import { Octokit } from '@octokit/rest'

export interface GitHubUser {
  login: string
  name: string
  email: string
  avatar_url: string
}

export interface GitHubRepo {
  name: string
  full_name: string
  html_url: string
  clone_url: string
  default_branch: string
}

export class GitHubService {
  private octokit: Octokit

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    })
  }

  async getUser(): Promise<GitHubUser> {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated()
      return {
        login: data.login,
        name: data.name || data.login,
        email: data.email || '',
        avatar_url: data.avatar_url,
      }
    } catch (error) {
      throw new Error('Failed to get GitHub user information')
    }
  }

  async createRepository(name: string, description?: string): Promise<GitHubRepo> {
    try {
      const { data } = await this.octokit.rest.repos.createForAuthenticatedUser({
        name,
        description: description || 'Website created with Zip2Vercel Wizard',
        private: false,
        auto_init: true,
      })

      return {
        name: data.name,
        full_name: data.full_name,
        html_url: data.html_url,
        clone_url: data.clone_url,
        default_branch: data.default_branch,
      }
    } catch (error) {
      if (error.status === 422) {
        throw new Error('Repository name already exists')
      }
      throw new Error('Failed to create GitHub repository')
    }
  }

  async uploadFiles(repoName: string, files: { [path: string]: string }, commitMessage: string = 'Initial commit from Zip2Vercel'): Promise<void> {
    try {
      const user = await this.getUser()
      const owner = user.login

      // Get the default branch
      const { data: repo } = await this.octokit.rest.repos.get({
        owner,
        repo: repoName,
      })

      const defaultBranch = repo.default_branch

      // Get the latest commit SHA
      const { data: ref } = await this.octokit.rest.git.getRef({
        owner,
        repo: repoName,
        ref: `heads/${defaultBranch}`,
      })

      const latestCommitSha = ref.object.sha

      // Get the tree of the latest commit
      const { data: latestCommit } = await this.octokit.rest.git.getCommit({
        owner,
        repo: repoName,
        commit_sha: latestCommitSha,
      })

      // Create blobs for all files
      const tree = []
      for (const [path, content] of Object.entries(files)) {
        const { data: blob } = await this.octokit.rest.git.createBlob({
          owner,
          repo: repoName,
          content: Buffer.from(content).toString('base64'),
          encoding: 'base64',
        })

        tree.push({
          path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        })
      }

      // Create a new tree
      const { data: newTree } = await this.octokit.rest.git.createTree({
        owner,
        repo: repoName,
        tree,
        base_tree: latestCommit.tree.sha,
      })

      // Create a new commit
      const { data: newCommit } = await this.octokit.rest.git.createCommit({
        owner,
        repo: repoName,
        message: commitMessage,
        tree: newTree.sha,
        parents: [latestCommitSha],
      })

      // Update the reference
      await this.octokit.rest.git.updateRef({
        owner,
        repo: repoName,
        ref: `heads/${defaultBranch}`,
        sha: newCommit.sha,
      })
    } catch (error) {
      throw new Error('Failed to upload files to GitHub repository')
    }
  }

  async checkRepositoryExists(name: string): Promise<boolean> {
    try {
      const user = await this.getUser()
      await this.octokit.rest.repos.get({
        owner: user.login,
        repo: name,
      })
      return true
    } catch (error) {
      return false
    }
  }

  static generateOAuthUrl(clientId: string, redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo user:email',
      state,
      response_type: 'code',
    })

    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  static async exchangeCodeForToken(clientId: string, clientSecret: string, code: string): Promise<string> {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error_description || 'OAuth exchange failed')
      }

      return data.access_token
    } catch (error) {
      throw new Error('Failed to exchange OAuth code for token')
    }
  }
}


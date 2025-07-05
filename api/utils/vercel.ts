export interface VercelDeployment {
  id: string
  url: string
  name: string
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED'
  createdAt: number
  readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED'
}

export interface VercelProject {
  id: string
  name: string
  accountId: string
  createdAt: number
  framework: string | null
  gitRepository?: {
    type: string
    repo: string
  }
}

export class VercelService {
  private token: string
  private teamId?: string

  constructor(token: string, teamId?: string) {
    this.token = token
    this.teamId = teamId
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `https://api.vercel.com${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.teamId) {
      headers['X-Vercel-Team-Id'] = this.teamId
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error?.message || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async createProject(name: string, gitRepository?: { type: string; repo: string }): Promise<VercelProject> {
    try {
      const payload: any = {
        name,
        framework: null,
      }

      if (gitRepository) {
        payload.gitRepository = gitRepository
      }

      const data = await this.makeRequest('/v9/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      return {
        id: data.id,
        name: data.name,
        accountId: data.accountId,
        createdAt: data.createdAt,
        framework: data.framework,
        gitRepository: data.gitRepository,
      }
    } catch (error) {
      throw new Error(`Failed to create Vercel project: ${error.message}`)
    }
  }

  async deployFromGitHub(projectId: string, gitRepository: { type: string; repo: string }): Promise<VercelDeployment> {
    try {
      const data = await this.makeRequest('/v13/deployments', {
        method: 'POST',
        body: JSON.stringify({
          name: projectId,
          gitSource: {
            type: gitRepository.type,
            repo: gitRepository.repo,
            ref: 'main',
          },
          projectSettings: {
            framework: null,
            buildCommand: null,
            outputDirectory: null,
            installCommand: null,
            devCommand: null,
          },
        }),
      })

      return {
        id: data.id,
        url: data.url,
        name: data.name,
        state: data.state,
        createdAt: data.createdAt,
        readyState: data.readyState,
      }
    } catch (error) {
      throw new Error(`Failed to deploy from GitHub: ${error.message}`)
    }
  }

  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    try {
      const data = await this.makeRequest(`/v13/deployments/${deploymentId}`)

      return {
        id: data.id,
        url: data.url,
        name: data.name,
        state: data.state,
        createdAt: data.createdAt,
        readyState: data.readyState,
      }
    } catch (error) {
      throw new Error(`Failed to get deployment: ${error.message}`)
    }
  }

  async waitForDeployment(deploymentId: string, maxWaitTime: number = 300000): Promise<VercelDeployment> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      const deployment = await this.getDeployment(deploymentId)
      
      if (deployment.readyState === 'READY') {
        return deployment
      }
      
      if (deployment.readyState === 'ERROR' || deployment.readyState === 'CANCELED') {
        throw new Error(`Deployment failed with state: ${deployment.readyState}`)
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    
    throw new Error('Deployment timeout')
  }

  async getProjects(): Promise<VercelProject[]> {
    try {
      const data = await this.makeRequest('/v9/projects')
      return data.projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        accountId: project.accountId,
        createdAt: project.createdAt,
        framework: project.framework,
        gitRepository: project.gitRepository,
      }))
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`)
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await this.makeRequest(`/v9/projects/${projectId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  async getTeams(): Promise<any[]> {
    try {
      const data = await this.makeRequest('/v2/teams')
      return data.teams || []
    } catch (error) {
      throw new Error(`Failed to get teams: ${error.message}`)
    }
  }

  static generateProjectName(originalName: string): string {
    // Convert to lowercase and replace invalid characters
    let name = originalName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Ensure it starts with a letter
    if (!/^[a-z]/.test(name)) {
      name = `site-${name}`
    }

    // Ensure it's not too long
    if (name.length > 63) {
      name = name.substring(0, 63).replace(/-$/, '')
    }

    // Add timestamp to make it unique
    const timestamp = Date.now().toString().slice(-6)
    return `${name}-${timestamp}`
  }
}


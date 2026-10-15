import projectSafetyPolicy from '../../config/project-safety.json' with { type: 'json' }

export interface RestrictedProjectInput {
  fullName: string
  description: string
  topics: string[]
}

const restrictedProjectPattern = new RegExp(
  projectSafetyPolicy.restrictedProjectPatterns.map((pattern) => `(?:${pattern})`).join('|'),
  'i',
)

export function isRestrictedGithubProject(
  project: Pick<RestrictedProjectInput, 'fullName' | 'description' | 'topics'>,
): boolean {
  return restrictedProjectPattern.test(
    [project.fullName, project.description, ...project.topics].join(' '),
  )
}

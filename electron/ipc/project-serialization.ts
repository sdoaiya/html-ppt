export function serializeProject(project: unknown) {
  return JSON.stringify(project, null, 2);
}

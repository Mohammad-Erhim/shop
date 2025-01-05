/**
 * Replaces placeholders in a template string with values from a replacements object.
 * @param {string} template - The template string containing placeholders.
 * @param {Record<string, string>} replacements - An object containing replacement values.
 * @returns {string} - The formatted string with placeholders replaced.
 */
export function formatMessage(
  template: string,
  replacements: Record<string, string>
): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => replacements[key] || '');
}

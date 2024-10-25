export function stripHtmlTags(content: string) {
  return content.replace(/<[^>]*>/g, '');
}
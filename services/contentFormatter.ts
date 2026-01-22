/**
 * Content Formatter Utility
 * Automatically converts plain text or partially formatted content into well-structured HTML
 */

/**
 * Auto-formats article content for better display
 * - Converts line breaks to paragraphs
 * - Detects and formats numbered lists
 * - Detects and formats bullet points
 * - Adds headings for sections that look like titles
 * - Wraps URLs in anchor tags
 */
export function formatArticleContent(content: string): string {
    if (!content) return '';

    // If content already has HTML structure (has paragraph or heading tags), return as-is
    if (/<(p|h[1-6]|div|ul|ol|li|blockquote)\s*>/.test(content)) {
        return content;
    }

    // Split content into lines
    const lines = content.split(/\n+/);
    let html = '';
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Detect section headers (lines that are short, followed by longer content, or all caps/title case)
        const isShortLine = line.length < 80 && !line.endsWith('.') && !line.endsWith(',');
        const nextLine = lines[i + 1]?.trim();
        const looksLikeHeader = isShortLine && nextLine && nextLine.length > line.length;
        const isNumberedHeader = /^\d+\.\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(line);

        // Close any open list
        const closeList = () => {
            if (inList) {
                html += listType === 'ol' ? '</ol>\n' : '</ul>\n';
                inList = false;
                listType = null;
            }
        };

        // Detect numbered list items (1. 2. etc or 1) 2) etc)
        if (/^[0-9]+[\.\)]\s+/.test(line)) {
            if (!inList || listType !== 'ol') {
                closeList();
                html += '<ol class="list-decimal list-inside space-y-2 my-4 ml-4">\n';
                inList = true;
                listType = 'ol';
            }
            const text = line.replace(/^[0-9]+[\.\)]\s+/, '');
            html += `<li class="text-gray-700">${formatInlineElements(text)}</li>\n`;
            continue;
        }

        // Detect bullet points (-, *, •)
        if (/^[-\*•]\s+/.test(line)) {
            if (!inList || listType !== 'ul') {
                closeList();
                html += '<ul class="list-disc list-inside space-y-2 my-4 ml-4">\n';
                inList = true;
                listType = 'ul';
            }
            const text = line.replace(/^[-\*•]\s+/, '');
            html += `<li class="text-gray-700">${formatInlineElements(text)}</li>\n`;
            continue;
        }

        // Close list if we're no longer in a list item
        closeList();

        // Format as heading if it matches patterns
        if (isNumberedHeader || (looksLikeHeader && line.length < 100)) {
            html += `<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">${formatInlineElements(line)}</h3>\n`;
            continue;
        }

        // Regular paragraph
        html += `<p class="mb-4 text-gray-700 leading-relaxed">${formatInlineElements(line)}</p>\n`;
    }

    // Close any remaining open list
    if (inList) {
        html += listType === 'ol' ? '</ol>\n' : '</ul>\n';
    }

    return html;
}

/**
 * Format inline elements like bold, italic, links
 */
function formatInlineElements(text: string): string {
    // Convert URLs to links
    text = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-brand-blue hover:underline">$1</a>'
    );

    // Convert **text** to bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

    // Convert *text* or _text_ to italic
    text = text.replace(/[\*_]([^*_]+)[\*_]/g, '<em class="italic">$1</em>');

    // Convert quoted text like "..." to styled quotes
    text = text.replace(/"([^"]+)"/g, '<span class="text-gray-600">"$1"</span>');

    return text;
}

/**
 * Generate a reading time estimation
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extract first image from content
 */
export function extractFirstImage(content: string): string | null {
    const match = content.match(/<img[^>]+src="([^"]+)"/);
    return match ? match[1] : null;
}

/**
 * Create a table of contents from headings
 */
export function generateTableOfContents(content: string): { id: string; title: string; level: number }[] {
    const headings: { id: string; title: string; level: number }[] = [];
    const regex = /<h([2-4])[^>]*>([^<]+)<\/h\1>/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const title = match[2].trim();
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ id, title, level });
    }

    return headings;
}

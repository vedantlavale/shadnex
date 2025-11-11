/**
 * Utility to create a box around text
 */
export function createBox(message: string): string {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(line => {
    // Strip ANSI codes for length calculation
    return line.replace(/\u001b\[[0-9;]*m/g, '').length;
  }));
  const horizontalBorder = '─'.repeat(maxLength + 2);
  
  const box = [
    `╭${horizontalBorder}╮`,
    ...lines.map(line => `│ ${line.padEnd(maxLength + (line.length - line.replace(/\u001b\[[0-9;]*m/g, '').length))} │`),
    `╰${horizontalBorder}╯`
  ];
  
  return box.join('\n');
}

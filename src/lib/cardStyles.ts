/**
 * Consistent card styles for all components
 * Ensures uniform appearance across dark and light modes
 */

export const cardBaseStyles = `
  bg-white dark:bg-surface-dark 
  border border-slate-200 dark:border-slate-800 
  rounded-3xl 
  shadow-sm 
  transition-all duration-500
`;

export const cardHoverStyles = `
  hover:border-primary-light/50 
  hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] 
  dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] 
  hover:-translate-y-2
`;

export const cardInteractiveStyles = `
  ${cardBaseStyles} 
  ${cardHoverStyles} 
  cursor-pointer
`;

export const cardPadding = 'p-6';

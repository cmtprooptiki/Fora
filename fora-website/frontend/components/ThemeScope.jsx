import { forumThemeVars } from '../lib/theme';

// Τυλίγει το περιεχόμενο μιας σελίδας Forum και εφαρμόζει την εμφάνιση
// (χρώματα, φόντο, γραμματοσειρά τίτλων) ΜΟΝΟ σε αυτή τη σελίδα.
export default function ThemeScope({ forum, children }) {
  const vars = forumThemeVars(forum);
  return (
    <div className="theme-scope" style={vars}>
      {children}
    </div>
  );
}

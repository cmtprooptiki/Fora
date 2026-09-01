import Hero from '../../../components/Hero';
import ThematicSections from '../../../components/ThematicSections';
import HeroImage from '../../../components/HeroImage';
import Programma from '../../../components/Programma';
import Speakers from '../../../components/Speakers';
import Sponsors from '../../../components/Sponsors';
import Gallery from '../../../components/Gallery';
import Videos from '../../../components/Videos';
import ThemeScope from '../../../components/ThemeScope';
import { getAllForums, getForumBySlug } from '../../../lib/strapi';

// Η σελίδα κάθε διοργάνωσης φτιάχνεται ΤΗΝ ΩΡΑ ΤΗΣ ΕΠΙΣΚΕΨΗΣ, διαβάζοντας
// ζωντανά το Strapi. Έτσι: (α) νέο Forum εμφανίζεται χωρίς νέα έκδοση,
// (β) δεν χρειάζεται λίστα σελίδων εκ των προτέρων (generateStaticParams),
// η οποία σε συνδυασμό με «φρέσκα» δεδομένα προκαλούσε σφάλμα 500
// («Page changed from static to dynamic at runtime»).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const forum = await getForumBySlug(params.slug);
  if (!forum) return {};
  const ordinal = forum.arithmos ? `${forum.arithmos}ο` : '';
  return {
    title: `${ordinal} Υβριδικό Forum ${forum.etos} | FORA`,
    description: forum.thema,
  };
}

export default async function ForumPage({ params }) {
  const forum = await getForumBySlug(params.slug);
  const allForums = await getAllForums();
  const currentForum = allForums.find((f) => f.trexonForum) || null;

  if (!forum) {
    return (
      <section className="container empty-state">
        <h1>Δεν βρέθηκε</h1>
        <p className="section__intro">
          Η διοργάνωση που ζητήσατε δεν βρέθηκε. <a href="/istoriko/">Δείτε όλα τα Fora</a>.
        </p>
      </section>
    );
  }

  return (
    <ThemeScope forum={forum}>
      <Hero
        forum={forum}
        backHref="/istoriko/"
        backLabel="← Όλα τα προηγούμενα Fora"
      />

      <ThematicSections forum={forum} intro={forum.eisagogikoKeimeno} />
      <HeroImage forum={currentForum} />
      <Programma forum={forum} />
      <Speakers forum={forum} />
      <Sponsors forum={forum} />
      <Gallery forum={forum} />
      <Videos forum={forum} />
    </ThemeScope>
  );
}

import Hero from '../components/Hero';
import HeroImage from '../components/HeroImage';
import ThematicSections from '../components/ThematicSections';
import Programma from '../components/Programma';
import Speakers from '../components/Speakers';
import PastForaCarousel from '../components/PastForaCarousel';
import Keywords from '../components/Keywords';
import Sponsors from '../components/Sponsors';
import MediaGallery from '../components/MediaGallery';
import ThemeScope from '../components/ThemeScope';
import { getCurrentForum, getAllForums } from '../lib/strapi';

export async function generateMetadata() {
  const forum = await getCurrentForum();
  if (!forum) return {};
  return {
    title: `${forum.arithmos}ο Υβριδικό Forum ${forum.etos} | FORA`,
    description: forum.thema,
  };
}

export default async function HomePage() {
  const forum = await getCurrentForum();
  const allForums = await getAllForums();

  if (!forum) {
    return (
      <section className="container empty-state">
        <h1>Καλωσορίσατε στο FORA</h1>
        <p className="section__intro">
          Δεν έχει οριστεί ακόμη τρέχον Forum. Συνδεθείτε στον πίνακα διαχείρισης
          (Strapi), δημιουργήστε ένα Forum και ενεργοποιήστε τον διακόπτη «Τρέχον
          Forum».
        </p>
      </section>
    );
  }

  return (
    <ThemeScope forum={forum}>
      <Hero forum={forum} />
      <ThematicSections forum={forum} intro={forum.eisagogikoKeimeno} />
      <HeroImage forum={forum} />
      <Programma forum={forum} />
      <Speakers forum={forum} />
      <PastForaCarousel forums={allForums} />
      <Keywords forum={forum} />
      <Sponsors forum={forum} />
      <MediaGallery forums={allForums} currentForum={forum} />
    </ThemeScope>
  );
}

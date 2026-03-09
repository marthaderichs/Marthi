import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
  { id: 'anaesthesie', name: 'Anästhesie', color: '#812644', icon: 'Syringe', description: 'Narkose & Schmerztherapie' },
  { id: 'arbeitsmed', name: 'Arbeitsmedizin', color: '#36708A', icon: 'Briefcase', description: 'Arbeit & Gesundheit' },
  { id: 'augen', name: 'Augenheilkunde', color: '#2488C5', icon: 'Eye', description: 'Erkrankungen des Auges' },
  { id: 'chirurgie', name: 'Chirurgie', color: '#2D3F35', icon: 'Scissors', description: 'Operative Verfahren' },
  { id: 'derma', name: 'Dermatologie', color: '#DD4E28', icon: 'Hand', description: 'Hauterkrankungen' },
  { id: 'allergo', name: 'Allergologie', color: '#B2DD9E', icon: 'Flower2', description: 'Allergien & Unverträglichkeiten' },
  { id: 'gyn', name: 'Gynäkologie', color: '#F25595', icon: 'Baby', description: 'Frauenheilkunde & Geburtshilfe' },
  { id: 'hno', name: 'HNO', color: '#EBC75C', icon: 'Ear', description: 'Hals, Nasen, Ohren' },
  { id: 'immuno', name: 'Immunologie', color: '#601A00', icon: 'Shield', description: 'Immunsystem' },
  { id: 'infektio', name: 'Infektiologie', color: '#BDDC7D', icon: 'Bug', description: 'Infektionskrankheiten' },
  { id: 'endo', name: 'Endokrinologie', color: '#AD9547', icon: 'Activity', description: 'Hormone & Stoffwechsel' },
  { id: 'gastro', name: 'Gastro', color: '#806B29', icon: 'Utensils', description: 'Verdauungsorgane' },
  { id: 'hemato_onko', name: 'Hämato/Onko', color: '#FFA9A5', icon: 'Droplet', description: 'Blut & Krebs' },
  { id: 'cardio', name: 'Kardiologie', color: '#D2423A', icon: 'Heart', description: 'Herz & Kreislauf' },
  { id: 'nephro', name: 'Nephrologie', color: '#025054', icon: 'Waves', description: 'Nieren & Harnwege' },
  { id: 'pneumo', name: 'Pneumologie', color: '#C7D9E5', icon: 'Wind', description: 'Lunge & Atmung' },
  { id: 'rheuma', name: 'Rheumatologie', color: '#AE9474', icon: 'Bone', description: 'Entzündliche Erkrankungen' },
  { id: 'intensiv', name: 'Intensiv & Notfall', color: '#601A00', icon: 'Siren', description: 'Akutmedizin' },
  { id: 'neuro', name: 'Neurologie', color: '#2488C5', icon: 'Brain', description: 'Nervensystem' },
  { id: 'patho', name: 'Pathologie', color: '#806B29', icon: 'Microscope', description: 'Krankheitslehre' },
  { id: 'pharma', name: 'Pharmakologie', color: '#EFCB84', icon: 'Pill', description: 'Arzneimittel' },
  { id: 'psych', name: 'Psychiatrie', color: '#812644', icon: 'BrainCircuit', description: 'Seelische Gesundheit' },
  { id: 'paedia', name: 'Pädiatrie', color: '#FFA9A5', icon: 'Smile', description: 'Kinderheilkunde' },
  { id: 'radio', name: 'Radiologie', color: '#36708A', icon: 'Scan', description: 'Bildgebung' },
  { id: 'reha', name: 'Rehabilitation', color: '#BDDC7D', icon: 'Accessibility', description: 'Wiederherstellung' },
  { id: 'sozial', name: 'Sozialmedizin', color: '#C7D9E5', icon: 'Users', description: 'Gesundheit & Gesellschaft' },
  { id: 'uro', name: 'Urologie', color: '#025054', icon: 'Droplets', description: 'Harnorgane & Genitalien' },
];

const mockTopics = [
  { id: 't1', subjectId: 'cardio', title: 'Arterielle Hypertonie', content: 'Die arterielle Hypertonie ist definiert als dauerhafte Blutdruckerhöhung auf ≥ 140/90 mmHg.' },
  { id: 't2', subjectId: 'pneumo', title: 'Pneumonie', content: 'Entzündung des Lungengewebes.' },
  { id: 't3', subjectId: 'neuro', title: 'Normaldruckhydrozephalus', content: 'Erweiterung der inneren Liquorräume bei normalem Liquordruck.' },
  { id: 't_eug_1', subjectId: 'gyn', title: 'Extrauteringravidität (EUG)', content: 'Die Extrauteringravidität (EUG) bezeichnet die Einnistung der befruchteten Eizelle außerhalb des Cavum uteri. In ca. 97% der Fälle liegt eine Tubargravidität vor, am häufigsten in der Ampulla tubae. Risikofaktoren sind Z.n. EUG, Tubenchirurgie, Chlamydieninfektion, IUP und assistierte Reproduktion. Klinisch imponieren einseitiger Unterbauchschmerz, Schmierblutungen und ein positiver Schwangerschaftstest. Bei Tubenruptur drohen ein hämorrhagischer Schock mit Peritonismus – ein absoluter Notfall! Diagnostisch wegweisend sind der transvaginale Ultraschall (keine intrauterine Fruchtanlage, ggf. Adnextumor) und der ß-hCG-Verlauf (inadäquater Anstieg <66% in 48h spricht für EUG). Therapie der Wahl ist die operative Laparoskopie (tubenerhaltende Salpingotomie oder Salpingektomie). Alternativ ist bei stabiler Patientin und kleiner EUG (<3,5 cm, ß-hCG <5000 IU/l) eine medikamentöse Therapie mit Methotrexat möglich.' },
];

const mockQuestions = [
  { id: 'q1', subjectId: 'cardio', topicId: 't1', text: 'Welches der folgenden Medikamente ist ein ACE-Hemmer?', options: ['Metoprolol', 'Ramipril', 'Amlodipin', 'Furosemid', 'Simvastatin'], correctAnswerIndex: 1, explanation: 'Ramipril ist ein ACE-Hemmer.' },
  { id: 'q2', subjectId: 'pneumo', topicId: 't2', text: 'Was ist der häufigste Erreger einer ambulant erworbenen Pneumonie (CAP)?', options: ['Staphylococcus aureus', 'Mycoplasma pneumoniae', 'Streptococcus pneumoniae', 'Legionella pneumophila', 'Haemophilus influenzae'], correctAnswerIndex: 2, explanation: 'Streptococcus pneumoniae ist der häufigste Erreger.' },
];

async function main() {
  console.log('Starting seed...');

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: subject,
      create: subject,
    });
  }

  for (const topic of mockTopics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: topic,
      create: topic,
    });
  }

  for (const q of mockQuestions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        ...q,
        options: JSON.stringify(q.options),
      },
      create: {
        ...q,
        options: JSON.stringify(q.options),
      },
    });
  }

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import jsPDF from "jspdf";

interface StudentData {
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  educationLevel: string;
  studentId: string;
  institution: string;
  program: string;
  birthCertNumber: string;
  guardianName: string;
  guardianPhone: string;
  status: string;
  submittedAt?: string;
}

export function exportStudentPdf(student: StudentData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header bar
  doc.setFillColor(20, 48, 100); // primary dark blue
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GestApprenants", 14, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Dossier de l'apprenant", 14, 28);

  // Status badge
  const statusLabel = student.status === "validated" ? "VALIDÉ" : student.status === "pending" ? "EN ATTENTE" : student.status === "rejected" ? "REJETÉ" : "INCOMPLET";
  doc.setFontSize(9);
  const badgeWidth = doc.getTextWidth(statusLabel) + 10;
  doc.setFillColor(student.status === "validated" ? 16 : student.status === "pending" ? 217 : 239, student.status === "validated" ? 185 : student.status === "pending" ? 157 : 68, student.status === "validated" ? 129 : student.status === "pending" ? 20 : 68);
  doc.roundedRect(pageWidth - badgeWidth - 14, 22, badgeWidth, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, pageWidth - badgeWidth - 14 + 5, 28);

  y = 52;

  const addSection = (title: string, fields: [string, string][]) => {
    doc.setFillColor(240, 243, 248);
    doc.roundedRect(10, y - 4, pageWidth - 20, 10, 2, 2, "F");
    doc.setTextColor(20, 48, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y + 3);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    fields.forEach(([label, value]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setTextColor(100, 100, 100);
      doc.text(label, 16, y);
      doc.setTextColor(30, 30, 30);
      doc.text(value || "—", 80, y);
      y += 8;
    });

    y += 6;
  };

  const genderLabel = student.gender === "M" ? "Masculin" : student.gender === "F" ? "Féminin" : student.gender;

  addSection("Informations personnelles", [
    ["Nom(s)", student.lastName],
    ["Prénom(s)", student.firstName],
    ["Date de naissance", student.birthDate],
    ["Lieu de naissance", student.birthPlace],
    ["Sexe", genderLabel],
    ["Nationalité", student.nationality],
    ["Adresse", student.address],
    ["Téléphone", student.phone],
    ["Email", student.email],
  ]);

  addSection("Informations académiques", [
    ["Niveau d'étude", student.educationLevel],
    ["ID étudiant", student.studentId],
    ["Établissement", student.institution],
    ["Filière / Classe", student.program],
  ]);

  addSection("Informations administratives", [
    ["N° acte de naissance", student.birthCertNumber],
    ["Tuteur légal", student.guardianName],
    ["Contact tuteur", student.guardianPhone],
  ]);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Page ${i}/${pageCount}`, 14, 290);
    doc.text("© GestApprenants — Confidentiel", pageWidth - 70, 290);
  }

  doc.save(`dossier_${student.lastName}_${student.firstName}.pdf`);
}

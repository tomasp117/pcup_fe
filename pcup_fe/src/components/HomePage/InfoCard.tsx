import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Mail, Phone, FileText, Download } from "lucide-react";

export const InfoCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kontaktní osoba */}
      <Card>
        <CardHeader>
          <CardTitle>Kontaktní osoba</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">Tomáš Prorok</p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" /> +420 733 272 824
          </p>
          {/* <p className="text-sm text-gray-500">(Dostupnost po 17 hodině)</p> */}
        </CardContent>
      </Card>

      {/* Kontaktní e-mail */}
      <Card>
        <CardHeader className=" ">
          <CardTitle>Kontaktní adresa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <a
              href="mailto:polankacup@gmail.com"
              className="text-primary hover:underline"
            >
              {/* polankacup@gmail.com */}
              tomas.prorok.st@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Propozice */}
      <Card>
        <CardHeader>
          <CardTitle>Organizace akce</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            download
            href="assets/informace.2025.docx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full  flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Informace k organizaci</span>
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Pozvánka */}
      <Card>
        <CardHeader>
          <CardTitle>Pozvánka</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="assets/pozvanka.2025.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full ">
              <Download className="w-4 h-4" />
              Pozvánka
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Plakát */}
      <Card>
        <CardHeader>
          <CardTitle>Plakát</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="assets/plakat.2025.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full  flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Stáhnout plakát</span>
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Rozlosování */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Rozlosování</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="https://www.polankacup.cz/2024/files/rozlosovani-41.2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full  flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Rozlosování turnaje</span>
            </Button>
          </a>
        </CardContent>
      </Card> */}
    </div>
  );
};

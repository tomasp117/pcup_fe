import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import image1 from "../../assets/praha.png";
import image2 from "../../assets/frydek.png";
import image3 from "../../assets/ostrava.gif";
import image4 from "../../assets/polanka.gif";
import image5 from "../../assets/zubri.png";
import image6 from "../../assets/gallery/test.jpg";
import Masonry from "react-masonry-css";
import { useState } from "react";
import { Dialog, DialogContent, DialogContentImage } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  image6,
  image1,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
  image6,
];

export default function GalleryCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const breakpointColumns = {
    default: 6,
    1280: 6,
    1024: 4,
    768: 3,
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prevIndex) => (prevIndex! + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        (prevIndex) => (prevIndex! - 1 + images.length) % images.length
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotogalerie</CardTitle>
      </CardHeader>
      <CardContent>
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-full gap-4"
          columnClassName="masonry-column"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md transform scale-90 hover:scale-100 transition-transform duration-300 ease-in-out cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={img}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-auto object-cover opacity-0 animate-fade-in"
                loading="lazy"
                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              />
            </div>
          ))}
        </Masonry>
      </CardContent>

      {/* Lightbox Dialog */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={() => setSelectedIndex(null)}
      >
        <DialogContentImage>
          <div
            className="relative flex items-center justify-center w-full h-full"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Šipka pro předchozí obrázek */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Zvětšený obrázek */}
            <img
              src={selectedIndex !== null ? images[selectedIndex] : ""}
              alt="Zvětšený obrázek"
              className="rounded-lg shadow-lg transition-all duration-300 max-w-[90vw] max-h-[90vh] object-contain"
            />

            {/* Šipka pro další obrázek */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Zabrání zavření při kliknutí na šipku
                handleNext();
              }}
              className="absolute right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>
        </DialogContentImage>
      </Dialog>
    </Card>
  );
}

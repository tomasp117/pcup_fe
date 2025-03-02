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

export const GalleryCard = () => {
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
              className="gallery-item"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={img}
                alt={`Gallery image ${index + 1}`}
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
          <div className="dialog" onClick={() => setSelectedIndex(null)}>
            {/* Šipka pro předchozí obrázek */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="button-prev"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Zvětšený obrázek */}
            <img
              src={selectedIndex !== null ? images[selectedIndex] : ""}
              alt="Zvětšený obrázek"
              className=""
            />

            {/* Šipka pro další obrázek */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Zabrání zavření při kliknutí na šipku
                handleNext();
              }}
              className="button-next"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>
        </DialogContentImage>
      </Dialog>
    </Card>
  );
};

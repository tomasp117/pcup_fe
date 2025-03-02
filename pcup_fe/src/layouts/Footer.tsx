import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import polankaLogo from "@/assets/polanka.gif";

export const Footer = () => {
  const [clipped, setClipped] = useState(true);

  useEffect(() => {
    const handleResize = () => setClipped(window.innerWidth > 1430);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="relative bg-gradient-to-tr from-primary/80 bg-primary/60 text-white mt-12">
      {/* Šikmý efekt pomocí `before` */}
      {clipped && (
        <div className="absolute inset-0 bg-white before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-tr before:from-primary/80 before:bg-primary/60 before:clip-path-footer shadow-inner"></div>
      )}

      {/* Obsah footeru */}
      <div className="relative max-w-full mx-auto py-10 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Levá část - logo */}
        <div className="relative h-full flex justify-start md:justify-start">
          <img
            src={polankaLogo}
            alt="HandballApp"
            className="h-full shadow-md"
          />
        </div>

        {/* Střední a pravá část - navigace */}
        <div className="relative md:col-span-2 flex flex-col md:flex-row flex-wrap justify-between text-sm gap-6">
          {/* Naše družstva */}
          <div className="w-full md:w-auto text-left">
            <h4 className="text-lg font-bold mb-2 text-primary-dark">
              Naše družstva
            </h4>
            <ul className="space-y-1">
              {[
                "Muži",
                "Starší dorost",
                "Mladší dorost",
                "Starší žáci",
                "Mladší žáci",
                "Minižáci",
              ].map((team) => (
                <li key={team}>
                  <Link
                    to={`/teams/${team.toLowerCase().replace(/\s/g, "-")}`}
                    className="hover:text-primary-dark"
                  >
                    {team}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Klubový eshop */}
          <div className="w-full md:w-auto text-left">
            <h4 className="text-lg font-bold mb-2 text-primary-dark">
              Klubový eshop
            </h4>
            <ul className="space-y-1">
              {[
                "Aktuality",
                "Cesta k nám",
                "Družstva",
                "Klub",
                "Partneři klubu",
                "Zápasy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="hover:text-primary-dark"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Klub Kontakt */}
          <div className="w-full md:w-auto text-left">
            <h4 className="text-lg font-bold mb-2 text-primary-dark">
              SKH Polanka n.O.
            </h4>
            <p className="text-gray-700">
              SK Házená Polanka nad Odrou, z.s.
              <br />
              Molákova 701/1
              <br />
              Polanka nad Odrou
              <br />
              725 25 Ostrava
            </p>
            <p className="mt-2 text-gray-700">
              IČ: 041 03 734
              <br />
              Č.ú. 272124568/0300
            </p>
            <p className="mt-4 text-gray-800 text-sm">
              &copy; {new Date().getFullYear()} SKH Polanka n.O.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

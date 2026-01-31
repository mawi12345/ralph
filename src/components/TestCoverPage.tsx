import { useEffect, useState } from "react";

type Props = {
  date: string;
  children: React.ReactNode;
};

function getPoints() {
  return ([...document.getElementsByClassName("points")] as HTMLSpanElement[])
    .map((e) => parseFloat(e.innerText.replace(",", ".")))
    .reduce((a, b) => a + b, 0);
}

function pointsFromPercentage(percentage: number, totalPoints: number) {
  return Math.round((percentage / 100) * totalPoints * 2) / 2;
}

function formatPoints(points: number) {
  return points.toString().replace(".", ",");
}

export function TestCoverPage({ date, children }: Props) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setPoints(getPoints());
  }, []);

  return (
    <>
      <div className="test-cover-page flex flex-col print:h-screen pt-20">
        <h1 className="text-4xl font-bold mb-4 text-center">{children}</h1>
        <p className="text-lg text-center">am {date}</p>
        <table className="table-auto mx-auto mt-2 text-xs w-full text-center">
          <thead>
            <tr>
              <th colSpan={6} className="px-4 py-2 text-lg font-bold">
                Notenschlüssel
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-4 py-2 font-bold w-[16.6%]">
                Punkte
              </td>
              <td className="border border-black px-4 py-2 w-[16.6%]">
                {formatPoints(points)} -{" "}
                {formatPoints(pointsFromPercentage(91, points))}
              </td>
              <td className="border border-black px-4 py-2 w-[16.6%]">
                {formatPoints(pointsFromPercentage(91, points) - 0.5)} -{" "}
                {formatPoints(pointsFromPercentage(80, points))}
              </td>
              <td className="border border-black px-4 py-2 w-[16.6%]">
                {formatPoints(pointsFromPercentage(80, points) - 0.5)} -{" "}
                {formatPoints(pointsFromPercentage(65, points))}
              </td>
              <td className="border border-black px-4 py-2 w-[16.6%]">
                {formatPoints(pointsFromPercentage(65, points) - 0.5)} -{" "}
                {formatPoints(pointsFromPercentage(50, points))}
              </td>
              <td className="border border-black px-4 py-2 w-[16.6%]">
                {formatPoints(pointsFromPercentage(50, points) - 0.5)} - 0
              </td>
            </tr>
            <tr>
              <td className="border border-black px-4 py-2 font-bold">Note</td>
              <td className="border border-black px-4 py-2">Sehr gut</td>
              <td className="border border-black px-4 py-2">Gut</td>
              <td className="border border-black px-4 py-2">Befriedigend</td>
              <td className="border border-black px-4 py-2">Genügend</td>
              <td className="border border-black px-4 py-2">Nicht genügend</td>
            </tr>
          </tbody>
        </table>
        <p className="text-lg text-center mt-20">
          Erreichte Punkte: _________________________
        </p>
        <p className="text-lg text-center mt-15">
          Note: ___________________________________
        </p>
        <p className="mb-0! text-lg text-center mt-15">
          _______________________________________________
        </p>
        <p className="text-xs text-center">
          Unterschrift des Erziehungsberechtigten
        </p>
        <table className="table-auto mx-auto mt-15 text-xs w-full text-center">
          <thead>
            <tr>
              <th colSpan={8} className="px-4 py-2 text-lg font-bold">
                Schularbeiten Statistik
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-4 py-2 font-bold w-[12.5%]">
                Note
              </td>
              <td className="border border-black px-4 py-2 w-[12.5%]">1</td>
              <td className="border border-black px-4 py-2 w-[12.5%]">2</td>
              <td className="border border-black px-4 py-2 w-[12.5%]">3</td>
              <td className="border border-black px-4 py-2 w-[12.5%]">4</td>
              <td className="border border-black px-4 py-2 w-[12.5%]">5</td>
              <td className="border border-black px-4 py-2 w-[12.5%]">
                abwesend
              </td>
              <td className="border border-black px-4 py-2 w-[12.5%]">
                Durchschnitt
              </td>
            </tr>
            <tr>
              <td className="border border-black px-4 py-2 font-bold">
                Anzahl
              </td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <style>{`
  @page {
    @top-left {
      content: "${date}";
      margin-left: 8mm;
      margin-top: 6mm;
    }
    @top-right {
      content: "Name: ________________________";
      margin-right: 8mm;
      margin-top: 6mm;
    }
    @bottom-right {
      content: "Seite " counter(page) " von " counter(pages);
      margin-right: 8mm;
    }
  }
`}</style>
    </>
  );
}

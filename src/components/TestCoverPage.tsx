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
        <table className="table-auto mx-auto mt-2 text-xs">
          <thead>
            <tr>
              <th
                colSpan={6}
                className="px-4 py-2 text-center text-lg font-bold"
              >
                Notenschlüssel
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-4 py-2 font-bold">
                Punkte
              </td>
              <td className="border border-black px-4 py-2 ">
                {points} - {Math.round(points * 0.9)}
              </td>
              <td className="border border-black px-4 py-2">
                {Math.round(points * 0.9) - 1} - {Math.round(points * 0.8)}
              </td>
              <td className="border border-black px-4 py-2">
                {Math.round(points * 0.8) - 1} - {Math.round(points * 0.65)}
              </td>
              <td className="border border-black px-4 py-2">
                {Math.round(points * 0.65) - 1} - {Math.round(points * 0.5)}
              </td>
              <td className="border border-black px-4 py-2">
                0 - {Math.round(points * 0.5) - 1}
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
        <p className="text-lg text-center mt-10">
          Erreichte Punkte: ___________________
        </p>
        <p className="text-lg text-center mt-10">
          Note: __________________________________
        </p>
        <p className="mb-0! text-lg text-center mt-10">
          _______________________________________________
        </p>
        <p className="text-xs text-center">
          Unterschrift des Erziehungsberechtigten
        </p>
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

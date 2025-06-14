
import html2canvas from "html2canvas";

// Helper for rendering a section and adding it to the PDF
export const renderAndAdd = async (
  doc: any,
  element: HTMLDivElement | null,
  title: string,
  maxW: number,
  maxH: number,
  y: number,
  opts: {center?: boolean} = {}
) => {
  if (!element) return y;
  const canvas = await html2canvas(element, {
    backgroundColor: "#fff",
    scale: 2,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });
  const imgData = canvas.toDataURL("image/png");
  let imgWidth = canvas.width, imgHeight = canvas.height;

  // Scale to fit, preserving aspect
  let scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
  imgWidth = imgWidth * scale;
  imgHeight = imgHeight * scale;

  doc.setFontSize(13);
  doc.setTextColor("#1566B8");
  const pageWidth = doc.internal.pageSize.getWidth();
  if (opts.center) {
    doc.text(title, pageWidth / 2, y, {align: "center"});
  } else {
    doc.text(title, 55, y);
  }
  y += 16;
  doc.addImage(imgData, "PNG", opts.center ? (pageWidth - imgWidth) / 2 : 55, y, imgWidth, imgHeight, undefined, "FAST");
  y += imgHeight + 12;
  return y;
};

// Formats the current date for title subtitles
export const getTodayDisplay = () => 
  new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;

const fontFile = (pkg, file) =>
  fs.readFileSync(path.join(process.cwd(), "node_modules", pkg, "files", file));

const fonts = [
  {
    name: "Fraunces",
    weight: 600,
    style: "normal",
    data: fontFile("@fontsource/fraunces", "fraunces-latin-600-normal.woff"),
  },
  {
    name: "Inter",
    weight: 400,
    style: "normal",
    data: fontFile("@fontsource/inter", "inter-latin-400-normal.woff"),
  },
  {
    name: "Inter",
    weight: 600,
    style: "normal",
    data: fontFile("@fontsource/inter", "inter-latin-600-normal.woff"),
  },
];

// Website palette (dark theme, green primary).
const COLORS = {
  overlay:
    "linear-gradient(90deg, rgba(10,9,7,0.96) 0%, rgba(10,9,7,0.85) 45%, rgba(10,9,7,0.1) 100%)",
  bg: "#15140f",
  primary: "#3fa34d",
  primaryText: "#0e1a0e",
  eyebrow: "#8fd39a",
  title: "#f6f4ec",
  muted: "#cdcbc1",
};

const h = (type, props = {}, children) => ({ type, props: { ...props, children } });

const truncate = (text = "", max) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export async function renderOgImage({ title, description, siteName, coverDataUri }) {
  const tree = h(
    "div",
    {
      style: {
        display: "flex",
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: COLORS.bg,
        fontFamily: "Inter",
      },
    },
    [
      h("img", {
        src: coverDataUri,
        width: WIDTH,
        height: HEIGHT,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          objectFit: "cover",
        },
      }),
      h("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          width: WIDTH,
          height: HEIGHT,
          backgroundImage: COLORS.overlay,
        },
      }),
      h(
        "div",
        {
          style: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 700,
            height: HEIGHT,
            padding: 64,
          },
        },
        [
          h("div", { style: { display: "flex", alignItems: "center" } }, [
            h("div", {
              style: { width: 44, height: 2, backgroundColor: COLORS.primary, marginRight: 16 },
            }),
            h(
              "div",
              {
                style: {
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: 4,
                  color: COLORS.eyebrow,
                  textTransform: "uppercase",
                },
              },
              siteName,
            ),
          ]),
          h(
            "div",
            {
              style: {
                display: "flex",
                fontFamily: "Fraunces",
                fontWeight: 600,
                fontSize: 46,
                lineHeight: 1.08,
                color: COLORS.title,
                marginTop: 20,
                overflow: "hidden",
              },
            },
            truncate(title, 72),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 1.4,
                color: COLORS.muted,
                marginTop: 20,
                overflow: "hidden",
              },
            },
            truncate(description, 150),
          ),
          h("div", { style: { display: "flex", marginTop: 38 } }, [
            h(
              "div",
              {
                style: {
                  display: "flex",
                  backgroundColor: COLORS.primary,
                  color: COLORS.primaryText,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: 1,
                  paddingTop: 15,
                  paddingBottom: 15,
                  paddingLeft: 34,
                  paddingRight: 34,
                  borderRadius: 8,
                  textTransform: "uppercase",
                },
              },
              "Saiba mais",
            ),
          ]),
        ],
      ),
    ],
  );

  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
  return resvg.render().asPng();
}

import type { CSSProperties, ElementType } from "react";
import { sample } from "../lib/color";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Wrap each word in a clipping mask so it can rise into view. */
  mask?: boolean;
  /**
   * Paint words with a gradient. Each word gets its own slice of the stops,
   * so the colour flows across the sentence and still works when words are
   * animated individually. `from` = first word index to colour.
   */
  gradient?: { stops: readonly string[]; from?: number };
  [data: `data-${string}`]: string | undefined;
};

/**
 * Splits text into per-word spans for scroll animation. Screen readers get the
 * sentence once via aria-label; the visual spans are hidden from them.
 */
const Words = ({ text, as: Tag = "span", className, id, mask = true, gradient, ...data }: Props) => {
  const words = text.split(" ");
  const from = gradient?.from ?? 0;
  const count = words.length - from;

  return (
    <Tag className={className} id={id} aria-label={text} {...data}>
      {words.map((word, i) => {
        const g = gradient && i >= from ? i - from : -1;
        const style =
          g >= 0
            ? ({
                "--gf": sample(gradient!.stops, g / count),
                "--gt": sample(gradient!.stops, (g + 1) / count),
              } as CSSProperties)
            : undefined;
        return (
          <span key={i} aria-hidden="true">
            <span className={`w${mask ? " w--mask" : ""}${g >= 0 ? " w--grad" : ""}`} style={style}>
              <span className="w__in">{word}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
};

export default Words;

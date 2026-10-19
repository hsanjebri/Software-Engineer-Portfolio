import Desktop from "./Desktop";
import "./Mac.css";

/**
 * A laptop with a hinged lid: the screen face shows the live desktop, the
 * back face is brushed aluminium. Hero.tsx scrubs the lid open on scroll.
 */
const MacBook = ({ booted }: { booted: boolean }) => (
  <div className="mac">
    <div className="mac__lid">
      <div className="mac__face mac__front">
        <span className="mac__notch" aria-hidden="true" />
        <div className="mac__screen">
          <Desktop booted={booted} />
          <span className="mac__glare" aria-hidden="true" />
        </div>
      </div>
      <div className="mac__face mac__cover" aria-hidden="true">
        <span className="mac__mark">{"{ }"}</span>
      </div>
    </div>
    <div className="mac__base" aria-hidden="true">
      <span className="mac__thumb" />
    </div>
    <span className="mac__shadow" aria-hidden="true" />
  </div>
);

export default MacBook;

import "./styles/Certificates.css";
import { config } from "../config";
import { MdArrowOutward } from "react-icons/md";

type Certificate = (typeof config.certificates)[number];

const getHref = (cert: Certificate) =>
  cert.link || cert.file || cert.image || "#";

const Certificates = () => {
  return (
    <div className="certificates-section section-container" id="certificates">
      <div className="certificates-container">
        <h2>
          Certificates <span>&</span>
          <br /> credentials
        </h2>
        <div className="certificates-grid">
          {config.certificates.map((cert) => {
            const href = getHref(cert);
            const showScores = Boolean(cert.scores) && !cert.image;

            return (
              <a
                key={cert.id}
                className={`certificate-card${showScores ? " certificate-card--ielts" : ""}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
              >
                {showScores && cert.scores ? (
                  <div className="certificate-ielts">
                    <div className="certificate-ielts-overall">
                      <span className="certificate-ielts-label">Overall</span>
                      <span className="certificate-ielts-band">
                        {cert.scores.overall}
                      </span>
                    </div>
                    <div className="certificate-ielts-skills">
                      <div>
                        <span>Listening</span>
                        <strong>{cert.scores.listening}</strong>
                      </div>
                      <div>
                        <span>Reading</span>
                        <strong>{cert.scores.reading}</strong>
                      </div>
                      <div>
                        <span>Writing</span>
                        <strong>{cert.scores.writing}</strong>
                      </div>
                      <div>
                        <span>Speaking</span>
                        <strong>{cert.scores.speaking}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="certificate-image">
                    {cert.image && (
                      <img src={cert.image} alt={cert.title} loading="lazy" />
                    )}
                  </div>
                )}
                <div className="certificate-info">
                  <div className="certificate-info-top">
                    <h4>{cert.title}</h4>
                    <MdArrowOutward className="certificate-arrow" />
                  </div>
                  <p className="certificate-issuer">{cert.issuer}</p>
                  {cert.date ? (
                    <p className="certificate-date">{cert.date}</p>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Certificates;

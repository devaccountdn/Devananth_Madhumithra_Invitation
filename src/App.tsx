import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CalendarPlus,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";

const venue =
  "Ananda Thirumana Maligai, Chrompet, Chennai 600044, opposite Chrompet Railway Station";
const mapUrl = "https://share.google/DFv4etFwRdy31rJhd";
const momentsUrl =
  "https://drive.google.com/drive/folders/1h-dEobLTfJZogxuFtfpf32s8pX6D6Mn5";
const events = [
  {
    id: "reception",
    label: "Reception",
    start: "20261115T133000Z",
    end: "20261115T163000Z",
    date: "Sunday, 15 November 2026",
    time: "7:00 p.m. onwards",
  },
  {
    id: "wedding",
    label: "Wedding",
    start: "20261116T003000Z",
    end: "20261116T020000Z",
    date: "Monday, 16 November 2026",
    time: "6:00 a.m. – 7:30 a.m.",
  },
] as const;
const menus = [
  {
    label: "Reception Dinner",
    date: events[0].date,
    image: "/images/menu-reception-dinner.jpeg",
  },
  {
    label: "Morning Tiffin",
    date: events[1].date,
    image: "/images/menu-morning-tiffin.jpeg",
  },
  {
    label: "Afternoon Lunch",
    date: events[1].date,
    image: "/images/menu-afternoon-lunch.jpeg",
  },
] as const;
const calendarEvents = events.map((event) => {
  const title = `S. Devananth & A. Madhumithra — ${event.label}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${event.start}/${event.end}`,
    ctz: "Asia/Kolkata",
    details: `With the blessings of Mr. B. Saravanan & Mrs. S. Girija and Mrs. P. Vanaja Arul & Mr. M. Arul.\n${venue}\n${mapUrl}\nPlease confirm your calendar reminders before saving.`,
    location: venue,
  });
  return {
    ...event,
    title,
    googleUrl: `https://calendar.google.com/calendar/render?${params.toString()}`,
  };
});
const escapeCalendar = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
const calendarContent =
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Devananth and Madhumithra//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    ...calendarEvents.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:devananth-madhumitha-${event.id}-202611@example.invalid`,
      "DTSTAMP:20261009T000000Z",
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `SUMMARY:${escapeCalendar(event.title)}`,
      `LOCATION:${escapeCalendar(venue)}`,
      `URL:${mapUrl}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeCalendar(event.title)} is tomorrow.`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeCalendar(event.title)} begins in 2 hours.`,
      "END:VALARM",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ]
    .map((line) => {
      const encoder = new TextEncoder();
      const folded: string[] = [];
      let part = "";
      for (const character of line) {
        if (encoder.encode(part + character).length > 74) {
          folded.push(part);
          part = " " + character;
        } else part += character;
      }
      folded.push(part);
      return folded.join("\r\n");
    })
    .join("\r\n") + "\r\n";
const calendarUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(calendarContent)}`;
const invitationImages = {
  gopuram: "/images/gopuram-smooth.jpg",
  trees: "/images/temple-trees-smooth.jpg",
  courtyard: "/images/temple-courtyard-smooth.jpg",
};

function TemplePhoto({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      className={className}
      src={invitationImages.gopuram}
      width={1620}
      height={2448}
      alt=""
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());
  const deadline = Date.parse(
    target.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
      "$1-$2-$3T$4:$5:$6Z",
    ),
  );
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
  const units = [
    { label: "Days", value: Math.floor(remaining / 86400) },
    { label: "Hours", value: Math.floor((remaining % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((remaining % 3600) / 60) },
    { label: "Seconds", value: remaining % 60 },
  ];
  return (
    <div className="countdown">
      {remaining === 0 && <Fireworks />}
      <p className="event-label">
        {remaining > 0
          ? "COUNTING DOWN TO OUR RECEPTION"
          : "THE CELEBRATION HAS BEGUN"}
      </p>
      <div
        className="countdown-units"
        role="timer"
        aria-label="Time until the reception"
        aria-live="off"
      >
        {units.map(({ label, value }) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Fireworks() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 9000);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <>
      <p className="celebration-message" role="status">
        Let the celebration begin! With love, Devananth & Madhumithra.
      </p>
      {visible && (
        <div className="fireworks" aria-hidden="true">
          {Array.from({ length: 6 }, (_, burst) => (
            <div
              className="firework-burst"
              key={burst}
              style={
                {
                  left: `${15 + ((burst * 29) % 72)}%`,
                  top: `${18 + ((burst * 17) % 48)}%`,
                  "--burst-delay": `${burst * 0.65}s`,
                  "--spark-color": ["#e5b54c", "#72b8b0", "#dc9b62"][burst % 3],
                } as CSSProperties
              }
            >
              {Array.from({ length: 16 }, (_, spark) => (
                <i
                  key={spark}
                  style={
                    { "--spark-angle": `${spark * 22.5}deg` } as CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ScratchDate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [canvasError, setCanvasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error(
        "Scratch card canvas is unavailable. Use the reveal-dates button.",
      );
      setCanvasError(true);
      return;
    }
    const gradient = context.createLinearGradient(0, 0, 600, 250);
    gradient.addColorStop(0, "#a57836");
    gradient.addColorStop(0.45, "#f0d99c");
    gradient.addColorStop(1, "#b48b4c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 600, 250);
    context.strokeStyle = "#79562680";
    context.lineWidth = 2;
    context.strokeRect(16, 16, 568, 218);
    context.fillStyle = "#674327";
    context.textAlign = "center";
    context.font = "32px Georgia";
    context.fillText("A little golden secret", 300, 106);
    context.font = "19px Georgia";
    context.fillText("Scratch here to discover our dates", 300, 148);
    context.font = "30px Georgia";
    context.fillText("✦", 300, 204);
  }, []);

  const scratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((event.clientY - rect.top) * canvas.height) / rect.height;
    const previous = pointerRef.current;
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 55;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(previous?.x ?? x, previous?.y ?? y);
    context.lineTo(x + 0.01, y + 0.01);
    context.stroke();
    pointerRef.current = { id: event.pointerId, x, y };
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let samples = 0;
    for (let y = 0; y < canvas.height; y += 8) {
      for (let x = 0; x < canvas.width; x += 8) {
        if (data[(y * canvas.width + x) * 4 + 3] < 128) cleared++;
        samples++;
      }
    }
    if (cleared / samples >= 0.4) {
      pointerRef.current = null;
      if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
      setRevealed(true);
    }
  };
  const finishStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerRef.current?.id !== event.pointerId) return;
    pointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="date-discovery">
      <p className="event-label">
        Our exclusive countdown begins right beneath here
      </p>
      <div className={`scratch-card${revealed ? " is-revealed" : ""}`}>
        <div className="scratch-date" aria-hidden={!revealed}>
          {events.map((event) => (
            <div className="scratch-event" key={event.id}>
              <span className="scratch-event-label">{event.label}</span>
              <strong>{event.date}</strong>
              <span className="scratch-event-time">
                <Clock3 size={14} aria-hidden="true" />
                <span>{event.time}</span>
              </span>
            </div>
          ))}
        </div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            width={600}
            height={250}
            aria-hidden="true"
            onPointerDown={(event) => {
              if (
                pointerRef.current ||
                (event.pointerType === "mouse" && event.button !== 0)
              )
                return;
              event.currentTarget.setPointerCapture(event.pointerId);
              scratch(event);
            }}
            onPointerMove={(event) => {
              if (pointerRef.current?.id === event.pointerId) scratch(event);
            }}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            onLostPointerCapture={() => {
              pointerRef.current = null;
            }}
          />
        )}
      </div>
      <div className="scratch-status" role="status">
        {revealed ? (
          <p>The secret is out. Save a place for us in your calendar!</p>
        ) : (
          <>
            <p>
              {canvasError
                ? "Scratching is unavailable in this browser."
                : "Rub the gold with your finger or mouse."}
            </p>
            <button
              className="reveal-date-button"
              type="button"
              onClick={() => setRevealed(true)}
            >
              Or tap to reveal both dates
            </button>
          </>
        )}
      </div>
      {revealed && <Countdown target={events[0].start} />}
    </div>
  );
}

function CalendarActions() {
  return (
    <div className="venue-calendar" id="calendar">
      <div
        className="calendar-actions"
        aria-label="Save both celebration dates"
      >
        <details className="google-calendar-picker">
          <summary className="calendar-link">
            <CalendarDays size={17} aria-hidden="true" />
            <span>Add both dates to Google Calendar</span>
          </summary>
          <div className="google-calendar-panel">
            <h3>Two celebrations. Two dates to save.</h3>
            <p>
              Open each event below and select Save in Google Calendar. Come
              back here to save the other date.
            </p>
            {calendarEvents.map((event) => (
              <a
                className="google-calendar-event"
                key={event.id}
                href={event.googleUrl}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarPlus size={18} aria-hidden="true" />
                <span>
                  <strong>Save {event.label.toLowerCase()}</strong>
                  <span>
                    {event.date}
                    <br />
                    {event.time}
                  </span>
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
            <p className="google-calendar-note">
              Google Calendar saves one event at a time. Please save both to
              keep both dates.
            </p>
          </div>
        </details>
        <a
          className="calendar-link calendar-link-secondary"
          href={calendarUrl}
          download="devananth-madhumithra-wedding.ics"
        >
          <CalendarPlus size={17} aria-hidden="true" />
          <span>Add both dates to Apple Calendar</span>
        </a>
      </div>
      <p className="calendar-reminders">
        Apple alerts: 1 day and 2 hours before each event.
        <br />
        Google Calendar uses your saved reminder settings.
        <br />
        Please confirm the events and allow calendar notifications.
      </p>
    </div>
  );
}

function MenuGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const menu = selected === null ? null : menus[selected];

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, [selected]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!track || !(slide instanceof HTMLElement)) return;
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <section className="event-details menu-card" aria-labelledby="menu-title">
      <div className="venue-block">
        <p className="event-label">CELEBRATION MENU</p>
        <h3 id="menu-title">A feast to remember</h3>
        <p>Swipe through our menus. Tap an image to enlarge and zoom.</p>
      </div>
      <div
        className="menu-track"
        ref={trackRef}
        role="region"
        aria-label="Celebration menus"
        aria-roledescription="carousel"
        onScroll={() => {
          const track = trackRef.current;
          if (!track) return;
          setActive(Math.round(track.scrollLeft / track.clientWidth));
        }}
      >
        {menus.map((item, index) => (
          <figure className="menu-slide" key={item.image}>
            <figcaption>
              <h4>{item.label}</h4>
              <p>{item.date}</p>
            </figcaption>
            <button
              className="menu-image-button"
              type="button"
              aria-label={`Enlarge ${item.label.toLowerCase()} menu`}
              aria-haspopup="dialog"
              onClick={() => {
                setZoom(1);
                setSelected(index);
              }}
            >
              <img
                src={item.image}
                alt={`${item.label} banana-leaf menu by Sindhu Catering, with labeled dishes`}
                width={1145}
                height={768}
                loading="lazy"
              />
              <span>
                <ZoomIn size={16} aria-hidden="true" /> Tap to enlarge
              </span>
            </button>
          </figure>
        ))}
      </div>
      <div className="menu-controls">
        <button
          type="button"
          aria-label="Previous menu"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p aria-live="polite">
          {active + 1} / {menus.length}
        </p>
        <button
          type="button"
          aria-label="Next menu"
          disabled={active === menus.length - 1}
          onClick={() => goTo(active + 1)}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <dialog
        className="menu-dialog"
        ref={dialogRef}
        aria-labelledby="menu-viewer-title"
        onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.currentTarget.close();
          }
        }}
      >
        {menu && (
          <>
            <div className="menu-viewer-toolbar">
              <h3 id="menu-viewer-title">{menu.label}</h3>
              <div className="menu-zoom-controls">
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={zoom === 1}
                  onClick={() => setZoom(zoom - 0.5)}
                >
                  <ZoomOut size={20} aria-hidden="true" />
                </button>
                <span aria-live="polite">{zoom * 100}%</span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={zoom === 3}
                  onClick={() => setZoom(zoom + 0.5)}
                >
                  <ZoomIn size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Close menu viewer"
                  onClick={() => dialogRef.current?.close()}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
            <p className="menu-viewer-help">
              Use + / - to zoom, then scroll or drag the scrollbars to explore.
              Press Escape to close.
            </p>
            <div
              className="menu-zoom-viewport"
              key={selected}
              tabIndex={0}
              role="region"
              aria-label="Zoomed menu image"
            >
              <img
                src={menu.image}
                alt={`${menu.label} banana-leaf menu by Sindhu Catering, with labeled dishes`}
                style={{ width: `${zoom * 100}%` }}
                width={1145}
                height={768}
              />
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}

function App() {
  const templeSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = templeSectionRef.current;
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    const update = () => {
      frameId = 0;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = reducedMotion.matches
        ? 1
        : Math.min(
            1,
            Math.max(0, -section.getBoundingClientRect().top / (travel * 0.9)),
          );
      section.style.setProperty("--temple-y", `${-progress * 25}svh`);
      section.style.setProperty("--temple-scale", `${1 + progress * 0.08}`);
      section.style.setProperty(
        "--title-opacity",
        `${Math.max(0, 1 - progress * 3)}`,
      );
      section.style.setProperty("--arch-y", `${(1 - progress) * 105}%`);
      section.style.setProperty("--trees-y", `${-progress * 12}svh`);
    };
    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <main>
      <a className="skip-link" href="#discover-date">
        Skip to invitation details
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          aria-label="Devananth and Madhumithra's invitation home"
        >
          {/* <span className="wordmark-seal" aria-hidden="true">
            ம
          </span> */}
          <span>
            DEVANANTH <i>&</i> MADHUMITHRA
          </span>
        </a>
        <nav aria-label="Invitation navigation">
          <a href="#discover-date">Our day</a>
          <a href="#reception">Reception</a>
          <a className="nav-rsvp" href="#calendar">
            Save the date <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <section
        className="temple-journey"
        id="home"
        ref={templeSectionRef}
        aria-labelledby="opening-title"
      >
        <div className="temple-stage">
          <div className="opening-title">
            {/* <p className="opening-blessing" lang="ta">
              திருமண அழைப்பிதழ்
            </p> */}
            <h1 id="opening-title">
              Devananth <span>weds</span> Madhumithra
            </h1>
            <p>A LIFETIME OF TOGETHERNESS</p>
          </div>
          <div className="temple-landscape" aria-hidden="true">
            <TemplePhoto className="opening-temple" priority />
          </div>
          <img
            className="garden"
            src={invitationImages.trees}
            width={1972}
            height={2960}
            alt=""
          />
          <div className="arch-arrival">
            <div className="invitation-arch">
              <img
                className="temple-arch"
                src={invitationImages.courtyard}
                width={2160}
                height={1440}
                alt=""
              />
              <div className="arch-copy">
                <img
                  className="vinayagar-mark"
                  src="/images/lord-ganesha.png"
                  width={768}
                  height={768}
                  alt="Lord Vinayagar"
                />
                <p>With the blessings of our families</p>
                <h2>We invite you</h2>
                <p>
                  to celebrate a lifetime of love, laughter
                  <br />
                  and togetherness.
                </p>
                <p className="arch-names">
                  S. Devananth <span>&</span> A. Madhumithra
                </p>
                <div className="arch-divider" aria-hidden="true">
                  ✦
                </div>
                <p>
                  A match woven by family, a story destined by fate.
                  <br />
                  Join us to watch as our destiny unfolds.
                </p>
                <a className="text-link" href="#discover-date">
                  Join our celebration{" "}
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#discover-date">
            <span>SCROLL TO UNFOLD</span>
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className="date-discovery-section"
        id="discover-date"
        aria-labelledby="date-discovery-title"
      >
        <p className="event-label">A DATE WRITTEN IN THE STARS</p>
        <h2 id="date-discovery-title">
          Discover our <i>special day.</i>
        </h2>
        <div className="date-discovery-panel">
          <ScratchDate />
        </div>
        <a className="text-link" href="#reception">
          Discover the celebration <ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>

      <section
        className="reception-section"
        id="reception"
        aria-labelledby="reception-title"
      >
        <div className="reception-stage">
          <div className="reception-scenery" aria-hidden="true">
            <img
              src={invitationImages.courtyard}
              width={2160}
              height={1440}
              loading="lazy"
              alt=""
            />
          </div>
          <div className="stage-topline">
            {/* <p className="section-index">
              01 <span>/</span> THE CELEBRATIONS
            </p>
            <p lang="ta">திருமண விழா</p> */}
          </div>
          <div className="stage-heading">
            <div className="kolam-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <b>✳</b>
            </div>
            <div>
              <p className="stage-kicker">A place at our table</p>
              <h2 id="reception-title">
                The celebration
                <br />
                <i>continues.</i>
              </h2>
            </div>
          </div>

          <div className="reception-reveal">
            <div className="event-details">
              <div className="venue-block">
                <p className="event-label">CELEBRATION VENUE</p>
                <h3>Ananda Thirumana Maligai</h3>
                <p>
                  Chrompet, Chennai - 44
                  <br />
                  Opposite Chrompet Railway Station
                </p>
                <a
                  className="map-link"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Google Maps <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="qr-block">
                <div className="qr-frame">
                  <QRCodeSVG
                    value={mapUrl}
                    size={112}
                    level="H"
                    marginSize={2}
                    bgColor="#fffdf6"
                    fgColor="#173f37"
                    title="Scan to open the reception and wedding venue in Google Maps"
                  />
                </div>
                <p>
                  THE WAY TO US
                  <br />
                  <span>Scan for directions</span>
                </p>
              </div>
            </div>
            <CalendarActions />
            <MenuGallery />
          </div>
        </div>
      </section>

      <section
        className="moments-section"
        id="share-moments"
        aria-labelledby="moments-title"
      >
        <div className="moments-card">
          <div className="moments-copy">
            <span className="moments-seal" aria-hidden="true">
              <Camera size={26} />
            </span>
            <p className="section-index">OUR DAY, THROUGH YOUR EYES</p>
            <h2 id="moments-title">
              Little moments.
              <br />
              <i>Forever memories.</i>
            </h2>
            <p>
              The happy tears, the laughter, the little in-between moments. If
              you capture a piece of our celebration, we would love to see it.
            </p>
            <p>
              Share your photos and videos in our wedding folder, and help us
              relive the day through your eyes.
            </p>
            <a
              className="moments-link"
              href={momentsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Camera size={18} aria-hidden="true" /> Share your moments
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <p className="moments-note">
              Opens Google Drive in a new tab. You may need to sign in. Please
              share only moments you are comfortable sharing with the couple and
              other folder members.
            </p>
          </div>
          <div className="moments-qr-panel">
            <span className="moments-ornament" aria-hidden="true">
              ✦
            </span>
            <a
              className="moments-qr-link"
              href={momentsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open our wedding photo and video folder in Google Drive"
            >
              <QRCodeSVG
                value={momentsUrl}
                size={200}
                level="H"
                marginSize={4}
                bgColor="#fffdf6"
                fgColor="#173f37"
                title="Scan to share wedding photos and videos in our Google Drive folder"
              />
            </a>
            <p className="moments-scan">SCAN. SHARE. CHERISH.</p>
            <p>
              Point your camera here
              <br />
              to open our shared memories folder.
            </p>
            <span className="moments-signature">
              With love,
              <br />
              Devananth & Madhumithra
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

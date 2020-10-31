import Head from "next/head";
import "../components/App";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Synthesia to MIDI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Synthesia to MIDI</h1>

        <div id="video-container">
          <div id="video-container-inner">
            <canvas id="video-canvas"></canvas>
            <canvas id="overlay-canvas"></canvas>
          </div>
        </div>

        <video
          id="video-player"
          src="/input.mp4"
          controls
          muted
          playsInline
          loop
        />
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0.5rem 0.5rem;
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        * {
          outline: none;
        }

        #video-container {
          background: hsl(203 25% 50% / 1);
          margin-top: 3em;
          margin-bottom: 3em;
          padding: 3em;
          width: 100vw;
          display: flex;
          flex-direction: column;
          alignitems: center;
          justifycontent: center;
          position: relative;
        }

        #video-player {
          margin: 0 auto;
          // visibility: hidden;
          position: absolute;
        }

        #video-container-inner {
          margin: 0 auto;
          position: relative;
        }

        #video-canvas,
        #overlay-canvas {
          width: 100%;
          height: 100%;
        }

        #overlay-canvas {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          // border: 0.5em solid;
          // border-image-slice: 1;
          // border-width: 0.5em 0.5em 3em 0.5em;
          // border-image-source: linear-gradient(to left, #677e8c, #2c404c);
          box-shadow: 0 4px 10px 0 rgba(34, 36, 38, 0.4),
            0 3px 10px 0 rgba(34, 36, 38, 0.4);
        }

        #video-canvas main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-weight: 400;
          font-size: 3.25rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          background: #b8c2cb;
          color: #36414d;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

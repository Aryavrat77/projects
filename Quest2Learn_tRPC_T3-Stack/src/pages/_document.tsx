import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx : any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html 
      
      lang="en">
        <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
          {/* <meta http-equiv="X-UA-Compatible" content="IE=edge" /> */}
          {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
          {/* <link href="../styles/globals.css" rel="stylesheet" /> */}
          {/* <title>Quest2Learn</title> */}
        </Head>
        <body >
            {/* <div > */}
            <div id="root"></div>
            <div id="overlay-root"></div> 

            {/* </div> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

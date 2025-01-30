import Image from 'next/image'
import backgroundImage from '../images/background-call-to-action.jpg'
import Button from './Button'
import Container from './Container'

export default function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            With Quest2Learn, you can enjoy an engaging and safe learning
            environment that will help you develop important lab skills. Join
            the many students and teachers who have already benefitted from our
            platform and discover how it can transform the way you learn
            science.
          </p>
          <Button href="https://calendly.com/chinat/30min" color="white" className="mt-10">
            Schedule a demo
          </Button>
        </div>
      </Container>
    </section>
  )
}
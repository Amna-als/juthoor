import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo2.png"
        alt="Juthoor Logo"
        width={120}
        height={60}
        style={{ height: 'auto', width: 'auto' }}
        className="object-contain"
        priority
      />
    </Link>
  )
}
import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#E3EAFF]">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Educat Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <Link href="/educat">
          <span className="text-xl font-bold cursor-pointer">EDUCAT</span>
        </Link>
      </div>
      <button className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-8 py-2 rounded">
        UPGRADE
      </button>
    </header>
  )
}

export default Header;

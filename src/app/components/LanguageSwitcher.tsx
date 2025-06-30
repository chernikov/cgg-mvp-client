'use client';

import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' }
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', languageCode)
    }
    router.refresh()
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="fixed top-4 right-4 z-50 w-10 h-10" />
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
          <GlobeAltIcon className="h-6 w-6 text-white" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white/10 backdrop-blur-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {languages.map((language) => (
                <Menu.Item key={language.code}>
                  {({ active }) => (
                    <button
                      onClick={() => handleLanguageChange(language.code)}
                      className={`${
                        active ? 'bg-white/20' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-white`}
                    >
                      {language.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
} 
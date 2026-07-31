import { Link } from 'react-router-dom'
import { landingAssetUrls } from '../../assets/landingAssets'
import { DESIGN_TOKENS, assetPaths, fallbackImages } from '../../constants/landingPage'
import { AssetImage, AssetIcon, Logo } from '../landing/Primitives'

const footerColumns = [
  { title: 'Product', items: ['App', 'Demo', 'FAQ', 'API'] },
  { title: 'For Developers', items: ['Docs', 'API', 'SDKs', 'Status'] },
  { title: 'Company', items: ['About', 'Blog', 'Pricing', 'Careers'] },
  { title: 'Support', items: ['Help Center', 'Contact', 'Terms of Use', 'Privacy Policy'] },
]

export function LandingMarketingFooter() {
  return (
    <footer
      className="relative overflow-hidden text-white"
      id="contact"
      style={{ backgroundColor: '#0B1020' }}
    >
      <div className="absolute inset-0 opacity-25">
        <AssetImage
          src={landingAssetUrls.midBanner}
          alt="Footer background"
          className="h-full w-full object-cover"
          fallback={fallbackImages.image}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: DESIGN_TOKENS.colors.footerOverlay }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.2fr_repeat(5,0.7fr)] md:px-10">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            Leveraging machine learning to estimate property value and connect
            owners and buyers with trusted real estate agencies.
          </p>
          <div className="mt-6 flex items-center gap-3 text-white/70">
            <a
              href="#"
              className="rounded-full border border-white/10 p-2 hover:text-white"
              aria-label="Facebook"
            >
              <AssetIcon
                src={assetPaths.facebookIcon}
                alt="Facebook"
                className="h-4 w-4"
                invert
              />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/10 p-2 hover:text-white"
              aria-label="Instagram"
            >
              <AssetIcon
                src={assetPaths.instagramIcon}
                alt="Instagram"
                className="h-4 w-4"
                invert
              />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/10 p-2 hover:text-white"
              aria-label="LinkedIn"
            >
              <AssetIcon
                src={assetPaths.linkedinIcon}
                alt="LinkedIn"
                className="h-4 w-4"
                invert
              />
            </a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h5
              className="text-sm font-semibold text-white"
              style={{
                fontFamily: DESIGN_TOKENS.fonts.display,
                letterSpacing: '-0.02em',
              }}
            >
              {column.title}
            </h5>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {column.items.map((item) => (
                <li key={item}>
                  {item === 'Pricing' ? (
                    <Link to="/#pricing" className="transition hover:text-white">
                      {item}
                    </Link>
                  ) : (
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h5
            className="text-sm font-semibold text-white"
            style={{
              fontFamily: DESIGN_TOKENS.fonts.display,
              letterSpacing: '-0.02em',
            }}
          >
            Newsletter
          </h5>
          <div className="mt-5 flex overflow-hidden rounded-md border border-white/10 bg-white/5">
            <input
              placeholder="Email"
              className="h-11 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              className="flex w-12 items-center justify-center bg-white"
              aria-label="Submit newsletter email"
              style={{ color: DESIGN_TOKENS.colors.secondary }}
            >
              <AssetIcon
                src={assetPaths.arrowRightIcon}
                alt="Submit"
                className="h-4 w-4"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingMarketingFooter

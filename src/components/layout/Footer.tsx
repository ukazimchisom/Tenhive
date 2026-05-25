import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-900">
                <Link href="/">
                  Ten<span className="text-orange-500">hive</span>
                </Link>
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Your one-stop destination for quality products at the best prices.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/products" },
                { label: "Cart", href: "/cart" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Sign In", href: "/login" },
                { label: "Create Account", href: "/signup" },
                { label: "My Orders", href: "/dashboard/orders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Track Order" },
                { label: "Wish List" },
                { label: "Support" },
                { label: "Returns" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ShopWave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

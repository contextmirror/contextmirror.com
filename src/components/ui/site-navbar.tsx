import { Home, Sparkles, Mic, BookOpen, Newspaper, Github } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Features", url: "/#features", icon: Sparkles },
  { name: "Voice Mirror", url: "/voice-mirror/", icon: Mic },
  { name: "Docs", url: "/docs/introduction/", icon: BookOpen },
  { name: "Blog", url: "/blog/", icon: Newspaper },
  { name: "GitHub", url: "https://github.com/contextmirror", icon: Github },
]

export function SiteNavBar() {
  return <NavBar items={navItems} />
}

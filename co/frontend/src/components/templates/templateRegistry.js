import PopularClassicTwoColumnTemplate from "./PopularClassicTwoColumnTemplate";
import PopularModernMinimalTemplate from "./PopularModernMinimalTemplate";
import CreativeSidebarShapesTemplate from "./CreativeSidebarShapesTemplate";
import CreativeAvatarCardTemplate from "./CreativeAvatarCardTemplate";
import ModernTealHeaderTemplate from "./ModernTealHeaderTemplate";
import ModernBoldLeftTemplate from "./ModernBoldLeftTemplate";
import ClassicTraditionalSerifTemplate from "./ClassicTraditionalSerifTemplate";
import ClassicConservativeCenteredTemplate from "./ClassicConservativeCenteredTemplate";
import NavyHeaderTemplate from "./NavyHeaderTemplate";
import GoldStripeTemplate from "./GoldStripeTemplate";
import BlueBannerTemplate from "./BlueBannerTemplate";
import SidebarContactTemplate from "./SidebarContactTemplate";
import DarkSidebarInitialsTemplate from "./DarkSidebarInitialsTemplate";
import PhotoTealTemplate from "./PhotoTealTemplate";
import BoldIntroTemplate from "./BoldIntroTemplate";
import ShapesCreativeTemplate from "./ShapesCreativeTemplate";
import InitialsAvatarTemplate from "./InitialsAvatarTemplate";
import CompactDenseTemplate from "./CompactDenseTemplate";
import ThreeColumnSkillsTemplate from "./ThreeColumnSkillsTemplate";

export const CATEGORY_LABELS = ["Popular", "Creative", "Modern", "Classic"];

export const ACCENT_PRESETS = [
  { name: "White", value: "#f8fafc" },
  { name: "Dark", value: "#111827" },
  { name: "Beige", value: "#d6bfa6" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Teal", value: "#0f766e" },
  { name: "Red", value: "#b91c1c" },
];

export const TEMPLATE_REGISTRY = [
  {
    id: "popular-classic-two-column",
    name: "Classic Two-Column",
    category: "Popular",
    defaultAccent: "#1e3a8a",
    Component: PopularClassicTwoColumnTemplate,
  },
  {
    id: "popular-modern-minimal",
    name: "Modern Minimal",
    category: "Popular",
    defaultAccent: "#2563eb",
    Component: PopularModernMinimalTemplate,
  },
  {
    id: "popular-sidebar-contact",
    name: "Sidebar Contact",
    category: "Popular",
    defaultAccent: "#475569",
    Component: SidebarContactTemplate,
  },
  {
    id: "popular-three-column-skills",
    name: "Three Column Skills",
    category: "Popular",
    defaultAccent: "#1e3a8a",
    Component: ThreeColumnSkillsTemplate,
  },
  {
    id: "creative-sidebar-shapes",
    name: "Left Sidebar Shapes",
    category: "Creative",
    defaultAccent: "#0f766e",
    Component: CreativeSidebarShapesTemplate,
  },
  {
    id: "creative-avatar-card",
    name: "Avatar Initials Card",
    category: "Creative",
    defaultAccent: "#2563eb",
    Component: CreativeAvatarCardTemplate,
  },
  {
    id: "creative-dark-sidebar-initials",
    name: "Dark Sidebar Initials",
    category: "Creative",
    defaultAccent: "#2d2d2d",
    Component: DarkSidebarInitialsTemplate,
  },
  {
    id: "creative-photo-teal",
    name: "Photo Teal",
    category: "Creative",
    defaultAccent: "#0d9488",
    Component: PhotoTealTemplate,
  },
  {
    id: "creative-shapes",
    name: "Shapes Creative",
    category: "Creative",
    defaultAccent: "#0f766e",
    Component: ShapesCreativeTemplate,
  },
  {
    id: "modern-teal-header",
    name: "Teal Accent Header",
    category: "Modern",
    defaultAccent: "#0f766e",
    Component: ModernTealHeaderTemplate,
  },
  {
    id: "modern-bold-left",
    name: "Bold Left Aligned",
    category: "Modern",
    defaultAccent: "#111827",
    Component: ModernBoldLeftTemplate,
  },
  {
    id: "modern-blue-banner",
    name: "Blue Banner",
    category: "Modern",
    defaultAccent: "#2563eb",
    Component: BlueBannerTemplate,
  },
  {
    id: "modern-bold-intro",
    name: "Bold Intro",
    category: "Modern",
    defaultAccent: "#fbbf24",
    Component: BoldIntroTemplate,
  },
  {
    id: "modern-initials-avatar",
    name: "Initials Avatar",
    category: "Modern",
    defaultAccent: "#2563eb",
    Component: InitialsAvatarTemplate,
  },
  {
    id: "classic-traditional-serif",
    name: "Traditional Serif",
    category: "Classic",
    defaultAccent: "#1f2937",
    Component: ClassicTraditionalSerifTemplate,
  },
  {
    id: "classic-conservative-centered",
    name: "Conservative Centered Header",
    category: "Classic",
    defaultAccent: "#1f2937",
    Component: ClassicConservativeCenteredTemplate,
  },
  {
    id: "classic-navy-header",
    name: "Navy Header",
    category: "Classic",
    defaultAccent: "#1a2e4a",
    Component: NavyHeaderTemplate,
  },
  {
    id: "classic-gold-stripe",
    name: "Gold Stripe",
    category: "Classic",
    defaultAccent: "#c9a84c",
    Component: GoldStripeTemplate,
  },
  {
    id: "classic-compact-dense",
    name: "Compact Dense",
    category: "Classic",
    defaultAccent: "#111827",
    Component: CompactDenseTemplate,
  },
];

export const DEFAULT_TEMPLATE_ID = "popular-classic-two-column";

export function getTemplateById(templateId) {
  return TEMPLATE_REGISTRY.find((template) => template.id === templateId) || TEMPLATE_REGISTRY[0];
}

export function getDefaultAccentForTemplate(templateId) {
  return getTemplateById(templateId).defaultAccent;
}

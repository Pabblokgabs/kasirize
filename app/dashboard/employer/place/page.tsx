"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Building2,
  Bus,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  EmployerPlace,
  getEmployerPlacesForUser,
} from "@/lib/places-data";

export type { EmployerPlace };

const STORAGE_KEY = "kasirize_employer_workplace_sites";

const DEFAULT_EMPLOYER_PLACES: EmployerPlace[] = [
  {
    id: "emp-site-1",
    name: "Massmart Central Distribution & Logistics Center",
    industry: "Supply Chain & Retail Distribution",
    siteType: "Distribution Center",
    tagline:
      "High-volume FMCG automated sorting, inventory audit, and fleet staging hub",
    address: "24 Enterprise Boulevard, City Deep",
    city: "Johannesburg",
    province: "Gauteng",
    interviewHubAddress: "Massmart Academy Building, Gate 3, City Deep",
    transitAccess:
      "Direct taxi rank & MetroRail commuter interchange adjacent to entrance",
    contactEmail: "recruitment@massmartlogistics.co.za",
    contactPhone: "+27 11 517 0000",
    website: "https://www.massmart.co.za/supply-chain",
    description:
      "Our premier 45,000 sqm distribution facility serving southern Africa. We actively host youth micro-internships, warehouse inventory pathways, and sponsored entry-level apprenticeships with 100% funded interview taxi transport.",
    photos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    ],
    workplacePerks: [
      "100% Funded Interview Taxi Vouchers",
      "Subsidized Staff Canteen",
      "Full PPE & Safety Equipment Provided",
      "SETA-Accredited Learnership Pathways",
      "Onsite Clinic & First Aid Lead",
    ],
    stats: {
      opportunitiesPosted: 12,
      hiresCompleted: 28,
      fundedVouchersIssued: 46,
      stipendPaidOutRands: 245000,
      retentionRatePercent: 88,
      mentorshipHours: 320,
    },
  },
  {
    id: "emp-site-2",
    name: "Sefako Technology & Digital Academy",
    industry: "Information Technology & Hardware Services",
    siteType: "Training Academy",
    tagline:
      "Youth IT practical repair, networking diagnostics, and cloud support academy",
    address: "188 Commissioner Street, CBD",
    city: "Johannesburg",
    province: "Gauteng",
    interviewHubAddress: "Floor 4, Innovation Lab A",
    transitAccess: "3 mins walk from Park Station & Rea Vaya Bus Rapid Transit",
    contactEmail: "learnerships@sefako.org.za",
    contactPhone: "+27 11 834 9100",
    website: "https://sefako.org.za",
    description:
      "A hands-on digital skills center connecting high-potential township youth with practical entry-level IT support, desktop repairs, and connectivity maintenance.",
    photos: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    ],
    workplacePerks: [
      "Taxi Transport Allowance",
      "High-speed Fiber & Tech Workstation",
      "Free Daily Lunch",
      "CompTIA Certification Support",
    ],
    stats: {
      opportunitiesPosted: 6,
      hiresCompleted: 14,
      fundedVouchersIssued: 22,
      stipendPaidOutRands: 98000,
      retentionRatePercent: 92,
      mentorshipHours: 190,
    },
  },
];

export default function EmployerPlacePage() {
  const [places, setPlaces] = useState<EmployerPlace[]>(() => {
    return getEmployerPlacesForUser();
  });

  const [activePlaceId, setActivePlaceId] = useState<string>(() => {
    const list = getEmployerPlacesForUser();
    return list.length > 0 ? list[0].id : "";
  });

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<EmployerPlace>>({});
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, WebP).");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file is too large (max 5MB).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          setFormData((prev) => ({
            ...prev,
            photos: [...(prev.photos || []), base64],
          }));
          toast.success(`Photo "${file.name}" uploaded from device media!`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const savePlacesToStorage = (updated: EmployerPlace[]) => {
    setPlaces(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const activePlace =
    places.find((p) => p?.id === activePlaceId) ||
    places[0] ||
    DEFAULT_EMPLOYER_PLACES[0];

  const handleOpenEdit = () => {
    if (!activePlace) return;
    setFormData({ ...activePlace });
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      industry: "Retail & Supply Chain",
      siteType: "Distribution Center",
      tagline: "",
      address: "",
      city: "Johannesburg",
      province: "Gauteng",
      interviewHubAddress: "",
      transitAccess: "Accessible via local taxi ranks & commuter rail",
      contactEmail: "",
      contactPhone: "",
      website: "",
      description: "",
      photos: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      ],
      workplacePerks: [
        "Funded Interview Transport Voucher",
        "Full Safety PPE Provided",
      ],
      stats: {
        opportunitiesPosted: 0,
        hiresCompleted: 0,
        fundedVouchersIssued: 0,
        stipendPaidOutRands: 0,
        retentionRatePercent: 100,
        mentorshipHours: 0,
      },
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error("Please fill in workplace name and address.");
      return;
    }

    const updated = places.map((p) =>
      p.id === activePlace.id ? ({ ...p, ...formData } as EmployerPlace) : p,
    );
    savePlacesToStorage(updated);
    setIsEditModalOpen(false);
    toast.success("Workplace site updated successfully!");
  };

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error("Please provide workplace title and address.");
      return;
    }

    const newPlace: EmployerPlace = {
      id: `emp-site-${Date.now()}`,
      name: formData.name || "Corporate Work Site",
      industry: formData.industry || "General Industry",
      siteType: formData.siteType || "Distribution Center",
      tagline:
        formData.tagline ||
        "Verified employer facility for youth opportunities",
      address: formData.address || "",
      city: formData.city || "Johannesburg",
      province: formData.province || "Gauteng",
      interviewHubAddress:
        formData.interviewHubAddress || formData.address || "",
      transitAccess: formData.transitAccess || "Near public transit corridors",
      contactEmail: formData.contactEmail || "hr@company.co.za",
      contactPhone: formData.contactPhone || "+27 11 000 0000",
      website: formData.website || "https://company.co.za",
      description:
        formData.description ||
        "Safe verified employer work facility participating in funded youth pathways.",
      photos:
        formData.photos && formData.photos.length > 0
          ? formData.photos
          : [
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
            ],
      workplacePerks: formData.workplacePerks || [
        "100% Funded Interview Taxi Vouchers",
      ],
      stats: {
        opportunitiesPosted: 0,
        hiresCompleted: 0,
        fundedVouchersIssued: 0,
        stipendPaidOutRands: 0,
        retentionRatePercent: 100,
        mentorshipHours: 0,
      },
    };

    const nextPlaces = [...places, newPlace];
    savePlacesToStorage(nextPlaces);
    setActivePlaceId(newPlace.id);
    setIsAddModalOpen(false);
    toast.success(`"${newPlace.name}" added to workplace directory!`);
  };

  const handleDeletePlace = () => {
    if (places.length <= 1) {
      toast.error("You must keep at least one active workplace site.");
      setIsDeleteModalOpen(false);
      return;
    }

    const filtered = places.filter((p) => p.id !== activePlace.id);
    savePlacesToStorage(filtered);
    setActivePlaceId(filtered[0].id);
    setIsDeleteModalOpen(false);
    toast.success("Workplace site removed.");
  };

  const handleRemovePhoto = (index: number) => {
    const current = [...(formData.photos || [])];
    current.splice(index, 1);
    setFormData({ ...formData, photos: current });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12 font-body">
      {/* ─── Header ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/employer"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeft className="size-4 mr-1" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <span>Workplace Facilities &amp; Hiring Sites</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Manage operational workplaces, interview arrival points, and
                taxi voucher links
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="text-xs font-semibold gap-1.5 bg-brand-deep text-white hover:opacity-90 cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Add Workplace Site</span>
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* ─── Facility Pills Selector ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
          {places.map((place) => {
            const isSelected = place.id === activePlace.id;
            return (
              <button
                key={place.id}
                onClick={() => setActivePlaceId(place.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Building2 className="size-3.5" />
                <span>{place.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {place.stats.hiresCompleted} Hired
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Facility Hero ─── */}
        <div className="bg-card rounded-card border border-border overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-auto bg-muted">
              {activePlace.photos && activePlace.photos.length > 0 ? (
                <Image
                  src={activePlace.photos[0]}
                  alt={activePlace.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Building2 className="size-12 mb-2 stroke-[1.5]" />
                  <span className="text-xs">No facility image</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="bg-black/75 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Building2 className="size-3 text-primary" />
                  <span>{activePlace.siteType}</span>
                </span>
                <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Bus className="size-3" />
                  <span>Taxi Transit Funded</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {activePlace.industry}
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                      {activePlace.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenEdit}
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit Facility</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground font-medium mb-3">
                  {activePlace.tagline}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span className="truncate">
                      {activePlace.address}, {activePlace.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="size-4 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium text-emerald-600">
                      {activePlace.transitAccess}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-primary shrink-0" />
                    <span className="truncate">{activePlace.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-primary shrink-0" />
                    <span className="truncate">{activePlace.contactPhone}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {activePlace.description}
                </p>
              </div>

              {/* Perks */}
              <div className="border-t border-border pt-3">
                <span className="text-[11px] font-bold text-foreground block mb-2">
                  Verified Workplace Standards &amp; Candidate Support:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePlace.workplacePerks.map((perk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-muted px-2.5 py-1 rounded-md text-foreground flex items-center gap-1.5 border border-border/60"
                    >
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      <span>{perk}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── WORKPLACE IMPACT & PATHWAY ANALYTICS ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Site Hiring &amp; Opportunity Analytics</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Measurable youth development track record for this operational
                site
              </p>
            </div>
            <Link
              href="/dashboard/employer/post-opportunity"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Plus className="size-3.5 mr-1" />
              <span>Post Role for this Site</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Roles Posted
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-foreground mt-1">
                {activePlace.stats.opportunitiesPosted}
              </p>
              <span className="text-[10px] text-primary font-medium">
                Learnerships &amp; Jobs
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Youth Hired
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-600 mt-1">
                {activePlace.stats.hiresCompleted}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Onsite placements
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Taxi Vouchers
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-brand-deep mt-1">
                {activePlace.stats.fundedVouchersIssued}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">
                100% Interview Funded
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Stipends Distributed
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-foreground mt-1">
                R {(activePlace.stats.stipendPaidOutRands / 1000).toFixed(0)}k
              </p>
              <span className="text-[10px] text-muted-foreground">
                Fair youth earnings
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Retention Rate
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-600 mt-1">
                {activePlace.stats.retentionRatePercent}%
              </p>
              <span className="text-[10px] text-muted-foreground">
                Through 6-month marks
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Mentorship Hours
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-primary mt-1">
                {activePlace.stats.mentorshipHours}h
              </p>
              <span className="text-[10px] text-muted-foreground">
                Onsite coaching logged
              </span>
            </div>
          </div>
        </section>

        {/* ─── PHOTOS GALLERY ─── */}
        <section className="bg-card rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" />
                <span>Workplace &amp; Interview Hub Photos</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Ensures candidates recognize interview gates and feel confident
                arriving on time
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenEdit}
              className="text-xs h-8 cursor-pointer"
            >
              <span>Manage Gallery ({activePlace.photos?.length || 0})</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activePlace.photos?.map((photo, i) => (
              <div
                key={i}
                className="relative h-36 rounded-md overflow-hidden bg-muted group border border-border/80"
              >
                <Image
                  src={photo}
                  alt={`${activePlace.name} photo ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded-full">
                    Facility #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── MODAL: EDIT FACILITY ─── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Edit Workplace Facility
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update workplace address, transit access notes, and photos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Facility Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Massmart Distribution Hub"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Site Type</Label>
                <select
                  value={formData.siteType || "Distribution Center"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      siteType: e.target.value as EmployerPlace["siteType"],
                    })
                  }
                  className="w-full text-xs h-9 px-3 rounded-md bg-background border border-input focus:ring-1"
                >
                  <option value="Distribution Center">
                    Distribution Center
                  </option>
                  <option value="Regional Hub">Regional Hub</option>
                  <option value="Headquarters">Headquarters</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Training Academy">Training Academy</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Headline / Subtitle</Label>
              <Input
                value={formData.tagline || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g. FMCG automated sorting and fleet staging hub"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Street Address</Label>
                <Input
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. 24 Enterprise Blvd"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">City &amp; Province</Label>
                <Input
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="e.g. Johannesburg, Gauteng"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Transit &amp; Taxi Rank Directions
              </Label>
              <Input
                value={formData.transitAccess || ""}
                onChange={(e) =>
                  setFormData({ ...formData, transitAccess: e.target.value })
                }
                placeholder="e.g. Direct taxi drop-off at Gate 3; MetroRail commuter link"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Hiring Lead Email</Label>
                <Input
                  value={formData.contactEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="hr@massmart.co.za"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Switchboard / Reception Phone</Label>
                <Input
                  value={formData.contactPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="+27 11 000 0000"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Facility &amp; Work Culture Description
              </Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe your facility, learnership structure, and candidate workplace perks..."
                className="text-xs"
              />
            </div>

            {/* Device Media Photos Upload */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold block">
                    Facility &amp; Interview Hub Photos
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Upload from your computer or phone media
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => editFileInputRef.current?.click()}
                  className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <Camera className="size-3.5" />
                  <span>Choose Media</span>
                </Button>
              </div>

              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary/60 rounded-btn p-4 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <UploadCloud className="size-6 text-primary mb-1.5" />
                <span className="text-xs font-semibold text-foreground">
                  Tap to upload workplace photos
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Entrance gates, reception, interview lab, or warehouse floor
                  (Max 5MB)
                </span>
              </button>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {formData.photos?.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 rounded bg-muted overflow-hidden border border-border group"
                  >
                    <Image
                      src={url}
                      alt={`Facility preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/75 text-white rounded-full p-1 hover:bg-destructive transition-colors shadow-xs"
                      title="Remove photo"
                    >
                      <Trash2 className="size-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded font-medium">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Save Facility
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: ADD FACILITY ─── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Register Workplace Hiring Site
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a branch, warehouse, or store where youth learnerships and
              jobs are located.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlace} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Facility / Site Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Massmart Regional Warehouse North"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Site Type</Label>
                <select
                  value={formData.siteType || "Distribution Center"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      siteType: e.target.value as EmployerPlace["siteType"],
                    })
                  }
                  className="w-full text-xs h-9 px-3 rounded-md bg-background border border-input focus:ring-1"
                >
                  <option value="Distribution Center">
                    Distribution Center
                  </option>
                  <option value="Regional Hub">Regional Hub</option>
                  <option value="Headquarters">Headquarters</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Training Academy">Training Academy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Physical Address</Label>
                <Input
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. 10 Warehouse Way"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">City / Region</Label>
                <Input
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="e.g. Pretoria West, Gauteng"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Transit &amp; Interview Arrival Instructions
              </Label>
              <Input
                value={formData.transitAccess || ""}
                onChange={(e) =>
                  setFormData({ ...formData, transitAccess: e.target.value })
                }
                placeholder="e.g. 100% funded taxi vouchers stop at Gate 2 entrance"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe this operational site and the youth pathways hosted here..."
                className="text-xs"
              />
            </div>

            {/* Device Media Photos Upload */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold block">
                    Facility &amp; Interview Hub Photos
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Upload from your device gallery or camera
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addFileInputRef.current?.click()}
                  className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <Camera className="size-3.5" />
                  <span>Choose Media</span>
                </Button>
              </div>

              <input
                ref={addFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => addFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary/60 rounded-btn p-4 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <UploadCloud className="size-6 text-primary mb-1.5" />
                <span className="text-xs font-semibold text-foreground">
                  Select workplace photos from device
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Gates, reception, workstation, or interview entrance (Max 5MB)
                </span>
              </button>

              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {formData.photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 rounded bg-muted overflow-hidden border border-border group"
                    >
                      <Image
                        src={url}
                        alt={`Upload preview ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/75 text-white rounded-full p-1 hover:bg-destructive transition-colors shadow-xs"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Create Workplace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: DELETE FACILITY ─── */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mb-2">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="font-heading text-base font-bold text-foreground">
              Delete &quot;{activePlace?.name}&quot;?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove this workplace facility? Open
              opportunity listings linked to this location will need to be
              re-assigned.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeletePlace}
              className="text-xs font-semibold"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

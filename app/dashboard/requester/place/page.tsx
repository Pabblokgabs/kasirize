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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle2,
  Clock,
  Footprints,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Store,
  Trash2,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { getRequesterPlacesForUser, RequesterPlace } from "@/lib/places-data";

export type { RequesterPlace };

const STORAGE_KEY = "kasirize_requester_business_places";

const DEFAULT_PLACES: RequesterPlace[] = [
  {
    id: "place-1",
    name: "Khumalo Fresh Market & Spaza",
    category: "Spaza Shop",
    tagline:
      "Cornerstone grocery and dairy distributor in Orlando East since 2014",
    address: "74 Vilakazi & Khumalo Street",
    ward: "Ward 39",
    township: "Orlando East, Soweto",
    operatingHours: "07:00 AM - 19:30 PM (Daily)",
    contactNumber: "+27 11 935 2411",
    safetyCheckPassed: true,
    walkingDistanceWard: "Ward 39 & Ward 40 (Under 15 mins walk)",
    photos: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1000&q=80",
    ],
    description:
      "A trusted neighbourhood spaza shop specializing in daily staple goods, fresh bread, dairy crates, and household necessities. We offer youth walking-distance micro-tasks including inventory auditing, stock replenishment, and morning delivery staging.",
    facilities: [
      "Safe Onsite Storage",
      "First Aid Station",
      "High Visibility Public Street",
      "CCTV Security Monitored",
      "Clean Drinking Water",
    ],
    stats: {
      tasksOffered: 24,
      tasksCompleted: 22,
      youthHelped: 18,
      totalPaidOutRands: 4860,
      averageRating: 4.9,
      repeatYouthWorkers: 6,
    },
  },
  {
    id: "place-2",
    name: "Orlando Corner Bakery Depot",
    category: "Bakery",
    tagline: "Artisan township bread, buns, and fresh morning confectionery",
    address: "12 Mosaka Way",
    ward: "Ward 39",
    township: "Orlando East, Soweto",
    operatingHours: "05:30 AM - 17:00 PM (Mon-Sat)",
    contactNumber: "+27 82 459 1102",
    safetyCheckPassed: true,
    walkingDistanceWard: "Ward 39 (Under 10 mins walk)",
    photos: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80",
    ],
    description:
      "Community bakery and distribution station for local kiosks. Youth tasks focus on packaging bread loaves, sealing bakery bags, and counting morning orders.",
    facilities: [
      "Food Hygiene Certified",
      "Indoor Prep Area",
      "Handwash Stations",
      "Escrow Guard Protected",
    ],
    stats: {
      tasksOffered: 15,
      tasksCompleted: 15,
      youthHelped: 11,
      totalPaidOutRands: 2850,
      averageRating: 5.0,
      repeatYouthWorkers: 4,
    },
  },
];

export default function RequesterPlacePage() {
  const [places, setPlaces] = useState<RequesterPlace[]>(() => {
    return getRequesterPlacesForUser();
  });

  const [activePlaceId, setActivePlaceId] = useState<string>(() => {
    const list = getRequesterPlacesForUser();
    return list.length > 0 ? list[0].id : "";
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<RequesterPlace>>({});
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

      // Check file size (limit 5MB)
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
          toast.success(`Photo "${file.name}" added from device media!`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const savePlacesToStorage = (updated: RequesterPlace[]) => {
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
    DEFAULT_PLACES[0];

  // Open edit
  const handleOpenEdit = () => {
    if (!activePlace) return;
    setFormData({ ...activePlace });
    setIsEditModalOpen(true);
  };

  // Open add
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "Spaza Shop",
      tagline: "",
      address: "",
      ward: "Ward 39",
      township: "Orlando East, Soweto",
      operatingHours: "08:00 AM - 18:00 PM",
      contactNumber: "",
      safetyCheckPassed: true,
      walkingDistanceWard: "Within walking distance (Ward 39)",
      description: "",
      facilities: ["Safe Storage", "Drinking Water", "First Aid Access"],
      photos: [
        "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
      ],
      stats: {
        tasksOffered: 0,
        tasksCompleted: 0,
        youthHelped: 0,
        totalPaidOutRands: 0,
        averageRating: 5.0,
        repeatYouthWorkers: 0,
      },
    });
    setIsAddModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error("Please complete the place name and address.");
      return;
    }

    const updated = places.map((p) =>
      p.id === activePlace.id ? ({ ...p, ...formData } as RequesterPlace) : p,
    );
    savePlacesToStorage(updated);
    setIsEditModalOpen(false);
    toast.success("Business place details updated successfully!");
  };

  // Create new place
  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error("Please provide a business name and location address.");
      return;
    }

    const newPlace: RequesterPlace = {
      id: `place-${Date.now()}`,
      name: formData.name || "My Business Site",
      category: formData.category || "Spaza Shop",
      tagline: formData.tagline || "Local community employer and task venue",
      address: formData.address || "",
      ward: formData.ward || "Ward 39",
      township: formData.township || "Orlando East",
      operatingHours: formData.operatingHours || "08:00 AM - 18:00 PM",
      contactNumber: formData.contactNumber || "+27 82 000 0000",
      safetyCheckPassed: true,
      walkingDistanceWard:
        formData.walkingDistanceWard || "Walking distance eligible",
      photos:
        formData.photos && formData.photos.length > 0
          ? formData.photos
          : [
              "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
            ],
      description:
        formData.description ||
        "Safe verified local business offering township youth paid short tasks.",
      facilities: formData.facilities || ["Safe Storage", "Drinking Water"],
      stats: {
        tasksOffered: 0,
        tasksCompleted: 0,
        youthHelped: 0,
        totalPaidOutRands: 0,
        averageRating: 5.0,
        repeatYouthWorkers: 0,
      },
    };

    const nextPlaces = [...places, newPlace];
    savePlacesToStorage(nextPlaces);
    setActivePlaceId(newPlace.id);
    setIsAddModalOpen(false);
    toast.success(`"${newPlace.name}" added to your task venues!`);
  };

  // Delete place
  const handleDeletePlace = () => {
    if (places.length <= 1) {
      toast.error(
        "You must maintain at least one business place for task listings.",
      );
      setIsDeleteModalOpen(false);
      return;
    }

    const filtered = places.filter((p) => p.id !== activePlace.id);
    savePlacesToStorage(filtered);
    setActivePlaceId(filtered[0].id);
    setIsDeleteModalOpen(false);
    toast.success("Place removed from your profile.");
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    const currentPhotos = [...(formData.photos || [])];
    currentPhotos.splice(index, 1);
    setFormData({ ...formData, photos: currentPhotos });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12 font-body">
      {/* ─── Top Header ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <Store className="size-5 text-primary" />
                <span>My Task Venues &amp; Business Places</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Manage physical locations where youth complete safe
                walking-distance tasks
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs font-semibold gap-1.5 bg-brand-deep text-white hover:opacity-90 cursor-pointer shadow-xs"
            >
              <Plus className="size-4" />
              <span>Add New Place</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* ─── Venue Selector Pills ─── */}
        <ScrollArea>
          <div className="flex items-center gap-2 pb-1 border-b border-border">
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
                  <Store className="size-3.5" />
                  <span>{place.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {place.stats.youthHelped} youth
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar hidden />
        </ScrollArea>

        {/* ─── Place Hero Banner ─── */}
        <div className="bg-card rounded-card border border-border overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Gallery / Main Photo */}
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
                  <Store className="size-12 mb-2 stroke-[1.5]" />
                  <span className="text-xs">No photo available</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="bg-black/75 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Store className="size-3 text-primary" />
                  <span>{activePlace.category}</span>
                </span>
                <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="size-3" />
                  <span>Safety Verified</span>
                </span>
              </div>
            </div>

            {/* Place Details & Quick Actions */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    {activePlace.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenEdit}
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit Place</span>
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
                      {activePlace.address}, {activePlace.township}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary shrink-0" />
                    <span className="truncate">
                      {activePlace.operatingHours}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-primary shrink-0" />
                    <span className="truncate">
                      {activePlace.contactNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Footprints className="size-4 text-emerald-600 shrink-0" />
                    <span className="truncate text-emerald-600 font-semibold">
                      {activePlace.walkingDistanceWard}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {activePlace.description}
                </p>
              </div>

              {/* Onsite Facilities Checklist */}
              <div className="border-t border-border pt-3">
                <span className="text-[11px] font-bold text-foreground block mb-2">
                  Verified Safety &amp; Onsite Amenities:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePlace.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-muted px-2.5 py-1 rounded-md text-foreground flex items-center gap-1.5 border border-border/60"
                    >
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── YOUTH IMPACT & VENUE ANALYTICS ─── */}
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 mb-5 md:mb-0">
            <div className="mb-5 md:m">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Venue Analytics &amp; Youth Impact</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Impact tracked for tasks offered directly at {activePlace.name}
              </p>
            </div>
            <Link
              href="/dashboard/requester/post-task"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Plus className="size-3.5 mr-1" />
              <span>Offer Task Here</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Tasks Offered
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-foreground mt-1">
                {activePlace.stats.tasksOffered}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">
                {activePlace.stats.tasksCompleted} Completed
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Youth Helped
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-primary mt-1">
                {activePlace.stats.youthHelped}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Local township youth
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Escrow Paid Out
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-600 mt-1">
                R {activePlace.stats.totalPaidOutRands.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Zero taxi fare needed
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Average Rating
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-amber-500 mt-1">
                ★ {activePlace.stats.averageRating.toFixed(1)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                By verified workers
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Repeat Workers
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-brand-deep mt-1">
                {activePlace.stats.repeatYouthWorkers}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Returned for shifts
              </span>
            </div>

            <div className="bg-card rounded-card border border-border p-3.5 shadow-xs">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Safety Record
              </span>
              <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-600 mt-1">
                100%
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">
                No disputes logged
              </span>
            </div>
          </div>
        </section>

        {/* ─── PHOTOS GALLERY SECTION ─── */}
        <section className="bg-card rounded-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" />
                <span>Place Photos &amp; Verification Proof</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Visible to applicants so they can recognize the storefront and
                meet safely
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
                    Photo #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── MODAL: EDIT PLACE ─── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Edit Business Venue
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update information, photos, and operating details for this task
              location.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Business / Venue Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Khumalo Fresh Market"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Business Type / Category</Label>
                <select
                  value={formData.category || "Spaza Shop"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as RequesterPlace["category"],
                    })
                  }
                  className="w-full text-xs h-9 px-3 rounded-md bg-background border border-input focus:ring-1"
                >
                  <option value="Spaza Shop">Spaza Shop</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Car Wash">Car Wash</option>
                  <option value="Community Hub">Community Hub</option>
                  <option value="Home Enterprise">Home Enterprise</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Tagline / Brief Subtitle</Label>
              <Input
                value={formData.tagline || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g. Cornerstone grocery and dairy distributor in Orlando East"
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
                  placeholder="e.g. 74 Vilakazi Street"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Ward &amp; Township</Label>
                <Input
                  value={formData.township || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, township: e.target.value })
                  }
                  placeholder="e.g. Orlando East, Soweto"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Operating Hours</Label>
                <Input
                  value={formData.operatingHours || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, operatingHours: e.target.value })
                  }
                  placeholder="e.g. 07:00 AM - 19:30 PM (Daily)"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Contact Phone</Label>
                <Input
                  value={formData.contactNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  placeholder="+27 11 935 2411"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Place Description for Youth Applicants
              </Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe your location, how youth arrive, and what working here is like..."
                className="text-xs"
              />
            </div>

            {/* Photos Manager via Device Media Upload */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold block">
                    Storefront &amp; Work Area Photos
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Upload photos directly from your phone or device
                    camera/gallery
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => editFileInputRef.current?.click()}
                  className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <Camera className="size-3.5" />
                  <span>Choose from Media</span>
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

              {/* Upload Dropzone Area */}
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary/60 rounded-btn p-4 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <UploadCloud className="size-6 text-primary mb-1.5" />
                <span className="text-xs font-semibold text-foreground">
                  Tap to upload venue photos
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Supports JPG, PNG, WebP up to 5MB (Ready to sync to database)
                </span>
              </button>

              {/* Photos Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {formData.photos?.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 rounded bg-muted overflow-hidden border border-border group"
                  >
                    <Image
                      src={url}
                      alt={`Photo preview ${idx + 1}`}
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: ADD PLACE ─── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Add New Business Venue
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a storefront, depot, or workshop where local youth can
              complete walking-distance tasks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlace} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Venue / Business Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Sindi's Spaza &amp; Cold Storage"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <select
                  value={formData.category || "Spaza Shop"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as RequesterPlace["category"],
                    })
                  }
                  className="w-full text-xs h-9 px-3 rounded-md bg-background border border-input focus:ring-1"
                >
                  <option value="Spaza Shop">Spaza Shop</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Car Wash">Car Wash</option>
                  <option value="Community Hub">Community Hub</option>
                  <option value="Home Enterprise">Home Enterprise</option>
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
                  placeholder="e.g. 14 Motswedi St"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Township / Ward</Label>
                <Input
                  value={formData.township || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, township: e.target.value })
                  }
                  placeholder="e.g. Meadowlands, Ward 39"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe your location, how to find it, and what tasks happen here..."
                className="text-xs"
              />
            </div>

            {/* Device Media Photos Upload */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold block">
                    Storefront &amp; Work Area Photos
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Upload from your device gallery or take a photo with your
                    camera
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addFileInputRef.current?.click()}
                  className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <Camera className="size-3.5" />
                  <span>Choose Photos</span>
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
                  Select place photos from device
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Front entrance, signage, counter, or workspace (Max 5MB per
                  file)
                </span>
              </button>

              {/* Photos Preview */}
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
                Create Place
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: DELETE PLACE ─── */}
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
              Are you sure you want to remove this location? Any historical task
              analytics will be detached from your active listings.
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

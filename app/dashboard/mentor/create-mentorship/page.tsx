"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateMentorshipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    specialty: "trade",
    description: "",
    maxMentees: "6",
    sessionFormat: "in_person",
    location: "Soweto Community Center",
    startDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-6 px-4 md:px-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/mentor"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Create Mentorship or Workshop
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Host practical micro-sessions, coach emerging youth, and endorse
          verified skills.
        </p>
      </div>

      {submitted ? (
        <div className="bg-card rounded-card border border-border shadow-card p-6 text-center space-y-4">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Mentorship Program Created!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your cohort for{" "}
            <span className="font-medium text-foreground">
              {formData.title}
            </span>{" "}
            is open for local youth enrollments.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Create Another
            </Button>
            <Link
              href="/dashboard/mentor"
              className={buttonVariants({ variant: "default" })}
            >
              Go to Mentors Hub
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Mentorship / Workshop Title</Label>
            <Input
              id="title"
              required
              placeholder="e.g. Hands-On Electrical Repairs & Safety Practicum"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="specialty">Skill Track</Label>
              <select
                id="specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="trade">
                  Artisan Trade (Electrical, Plumbing, Auto)
                </option>
                <option value="retail_sales">Retail & Customer Sales</option>
                <option value="hospitality">Hospitality & Barista Work</option>
                <option value="admin_tech">Digital Literacy & Admin</option>
                <option value="care_community">Community & Child Care</option>
                <option value="logistics">Logistics & Warehousing</option>
                <option value="creative">Creative & Content</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="format">Delivery Format</Label>
              <select
                id="format"
                value={formData.sessionFormat}
                onChange={(e) =>
                  setFormData({ ...formData, sessionFormat: e.target.value })
                }
                className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="in_person">In-Person Hands On</option>
                <option value="online">Online / WhatsApp Group Sessions</option>
                <option value="hybrid">Hybrid (Practical + Virtual)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="mentees">Max Mentee Cohort Size</Label>
              <Input
                id="mentees"
                type="number"
                min="1"
                max="25"
                required
                value={formData.maxMentees}
                onChange={(e) =>
                  setFormData({ ...formData, maxMentees: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Meeting Venue / Center</Label>
            <Input
              id="location"
              required
              placeholder="e.g. Kliptown Youth Program Hall"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Curriculum & Practical Tasks</Label>
            <Textarea
              id="description"
              rows={3}
              required
              placeholder="Detail what practical tasks mentees will complete and what skill endorsements they can earn..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <Button type="submit" className="w-full">
            <PlusCircle className="size-4 mr-2" />
            Launch Mentorship Cohort
          </Button>
        </form>
      )}
    </div>
  );
}

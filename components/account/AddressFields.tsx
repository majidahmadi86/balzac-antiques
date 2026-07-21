"use client";

// Shared address inputs used by both the add form and the edit form, so the
// two never drift. `d` prefills the fields when editing an existing address.
import { COUNTRIES } from "@/lib/countries";
import { usePrefs } from "@/components/Prefs";

type Defaults = {
  line1?: string;
  line2?: string | null;
  city?: string;
  postcode?: string;
  country?: string;
};

export default function AddressFields({ d }: { d?: Defaults }) {
  const { t } = usePrefs();
  const input =
    "w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold";
  const label = "mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60";

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className={label}>{t("addr.line1")}</span>
        <input name="line1" required maxLength={200} defaultValue={d?.line1 ?? ""} className={input} />
      </label>
      <label className="block">
        <span className={label}>{t("addr.line2")}</span>
        <input name="line2" maxLength={200} defaultValue={d?.line2 ?? ""} className={input} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>{t("addr.city")}</span>
          <input name="city" required maxLength={120} defaultValue={d?.city ?? ""} className={input} />
        </label>
        <label className="block">
          <span className={label}>{t("addr.postcode")}</span>
          <input name="postcode" required maxLength={40} defaultValue={d?.postcode ?? ""} className={input} />
        </label>
      </div>
      <label className="block">
        <span className={label}>{t("addr.country")}</span>
        <select name="country" required defaultValue={d?.country ?? ""} className={input}>
          <option value="" disabled>{t("addr.countryPlaceholder")}</option>
          {COUNTRIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

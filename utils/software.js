const compactFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumSignificantDigits: 3,
});

const fullFormatter = new Intl.NumberFormat("en");

export const SOFTWARE_TYPES = [
    { value: "all", label: "All" },
    { value: "microblogging", label: "Microblogging" },
    { value: "video", label: "Video" },
    { value: "image sharing", label: "Image sharing" },
    { value: "audio", label: "Audio" },
    { value: "blogging", label: "Blogging" },
    { value: "events", label: "Events" },
    { value: "forum", label: "Forums" },
    { value: "git", label: "Git" },
    { value: "other", label: "Other" },
];

export const SOFTWARE_METRICS = [
    { key: "servers", label: "Servers", field: "instance_count" },
    { key: "users", label: "Accounts", field: "user_count" },
    { key: "active", label: "MAU", field: "monthly_actives" },
    { key: "posts", label: "Posts", field: "status_count" },
];

export const SOFTWARE_SORTS = [
    { value: "active", label: "Monthly active" },
    { value: "users", label: "Accounts" },
    { value: "servers", label: "Servers" },
    { value: "posts", label: "Posts" },
    { value: "name", label: "Name" },
];

export function fullCount(value) {
    return fullFormatter.format(Number(value) || 0);
}

export function compactCount(value) {
    const number = Number(value) || 0;
    return number < 10000
        ? fullFormatter.format(number)
        : compactFormatter.format(number);
}

export function softwareTagLabel(tag) {
    const match = SOFTWARE_TYPES.find((type) => type.value === tag);
    if (match) return match.label;
    return tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : "";
}

export function softwareTagLine(software) {
    const tags = software?.tags ?? [];
    return tags.length
        ? tags.map(softwareTagLabel).join(", ")
        : "Uncategorized";
}

export function softwareMatchesType(software, type) {
    if (type === "all") return true;
    const tags = software?.tags ?? [];
    if (type === "other") return tags.length === 0 || tags.includes("other");
    return tags.includes(type);
}

export function softwareIsTracked(software) {
    return (software?.instance_count || 0) > 0;
}

export function softwareVersion(software) {
    if (software?.latest_version?.version) {
        return {
            value: software.latest_version.version,
            label: "Latest release",
        };
    }
    const deployed = (software?.versions ?? []).find((entry) => entry.version);
    return deployed
        ? { value: deployed.version, label: "Most deployed version" }
        : null;
}

export function generateBgColor(name) {
    if (!name) return 'bg-gray-600';

    const hash = [...name.toLowerCase()].reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    const colorOptions = [
        'bg-red-600',
        'bg-orange-600',
        'bg-amber-600',
        'bg-yellow-600',
        'bg-lime-600',
        'bg-green-600',
        'bg-emerald-600',
        'bg-teal-600',
        'bg-cyan-600',
        'bg-sky-600',
        'bg-blue-600',
        'bg-indigo-600',
        'bg-blue-600',
        'bg-purple-600',
        'bg-fuchsia-600',
        'bg-pink-600',
        'bg-rose-600',
    ];

    const index = Math.abs(hash) % colorOptions.length;
    return colorOptions[index];
}

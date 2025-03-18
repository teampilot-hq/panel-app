import React, { useMemo } from 'react';

interface ColorPalette {
    backgrounds: string[];
    texts: string[];
}

interface UserDefaultAvatarProps {
    /** Full name to generate initials from */
    name: string;
    /** Size of the avatar in pixels (both width and height) */
    size?: number;
    /** Optional CSS class name for additional styling */
    className?: string;
    /** Font family for the initials */
    fontFamily?: string;
    /** Custom color palette for backgrounds and text */
    colorPalette?: ColorPalette;
}

/**
 * UserDefaultAvatar - A React component that generates avatar circles with initials
 * similar to the example in the image.
 */
export default function UserDefaultAvatar({
                                              name,
                                              size = 48,
                                              className = '',
                                              fontFamily = 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                                              colorPalette = {
                                                  backgrounds: [
                                                      '#E8F2FF', // Light Blue
                                                      '#FFF1E8', // Light Orange/Peach
                                                      '#E8FFE9', // Light Green
                                                      '#F5E8FF', // Light Purple
                                                      '#FFE8E8', // Light Pink/Red
                                                      '#F2F4F7', // Light Grey
                                                      '#E8FBFF', // Light Cyan
                                                      '#FFF8E8', // Light Yellow
                                                      '#FFE8F7', // Light Pink
                                                      '#E8FFFD', // Light Mint
                                                      '#F7E8FF', // Light Lavender
                                                      '#FFE8EC', // Light Coral
                                                      '#E8FFF1', // Light Seafoam
                                                      '#FFF3E8', // Light Apricot
                                                      '#E8EEFF', // Light Periwinkle
                                                      '#FFFFE8'  // Light Cream
                                                  ],
                                                  texts: [
                                                      '#2E5AAC', // Dark Blue
                                                      '#AC6B2E', // Dark Orange
                                                      '#2EAC4A', // Dark Green
                                                      '#8A2EAC', // Dark Purple
                                                      '#AC2E2E', // Dark Red
                                                      '#4A5468', // Dark Grey
                                                      '#2E9DAC', // Dark Cyan
                                                      '#AC962E', // Dark Yellow
                                                      '#AC2E8A', // Dark Pink
                                                      '#2EACA3', // Dark Mint
                                                      '#892EAC', // Dark Lavender
                                                      '#AC2E4A', // Dark Coral
                                                      '#2EAC77', // Dark Seafoam
                                                      '#AC5F2E', // Dark Apricot
                                                      '#2E41AC', // Dark Periwinkle
                                                      '#ACAC2E'  // Dark Olive
                                                  ]
                                              }
                                          }: UserDefaultAvatarProps) {
    // Generate initials from the name
    const initials = useMemo((): string => {
        if (!name || typeof name !== 'string') return '??';

        const parts = name.trim().split(/\s+/);

        if (parts.length <= 1) {
            // If there's only one name, use the first two characters if possible
            return name.length > 1
                ? name.substring(0, 2).toUpperCase()
                : name.substring(0, 1).toUpperCase();
        }

        // Get first char of first name and first char of last name
        const firstInitial = parts[0].charAt(0);
        const lastInitial = parts[parts.length - 1].charAt(0);

        return (firstInitial + lastInitial).toUpperCase();
    }, [name]);

    // Get color index based on name
    const colorIndex = useMemo((): number => {
        if (!name) return 0;

        // Simple hash function to ensure consistent colors for the same name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash) + name.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        return Math.abs(hash) % colorPalette.backgrounds.length;
    }, [name, colorPalette.backgrounds.length]);

    // Get background and text colors
    const backgroundColor = colorPalette.backgrounds[colorIndex];
    const textColor = colorPalette.texts[colorIndex];

    // Calculate dimensions
    const strokeWidth = 1;
    const radius = (size / 2) - (strokeWidth / 2);
    const fontSize = size * 0.35; // 35% of circle size

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill={backgroundColor}
                stroke={textColor}
                strokeWidth={strokeWidth}
                strokeOpacity="0.2"
            />
            <text
                x={size / 2}
                y={(size / 2 + fontSize / 3) - 4}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {initials}
            </text>
        </svg>
    );
};
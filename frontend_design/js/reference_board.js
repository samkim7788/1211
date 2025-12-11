/**
 * Reference Board Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check Login
    if (!Auth.requireLogin()) return;

    // State
    let userPreferences = State.get('userPreferences', null);
    let userEmail = State.get('userEmail', '');
    let selectedStyles = userPreferences?.styles || [];

    const styleCategories = [
        'vintage', 'luxury', 'natural', 'scandinavian', 'french',
        'lovely', 'pastel', 'modern', 'bohemian', 'classic',
        'industrial', 'minimal'
    ];

    const categoryImages = {
        vintage: [
            'https://images.unsplash.com/photo-1725711362462-a0333461e1df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1710082777338-dcb6189ae64f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNDMwNnww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1725711362462-a0333461e1df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1710082777338-dcb6189ae64f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNDMwNnww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        luxury: [
            'https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        natural: [
            'https://images.unsplash.com/photo-1597562965673-42cc92e8408f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaW50ZXJpb3IlMjBzcGFjZXxlbnwxfHx8fDE3NjQxMzYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1597562965673-42cc92e8408f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaW50ZXJpb3IlMjBzcGFjZXxlbnwxfHx8fDE3NjQxMzYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1597562965673-42cc92e8408f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaW50ZXJpb3IlMjBzcGFjZXxlbnwxfHx8fDE3NjQxMzYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1597562965673-42cc92e8408f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaW50ZXJpb3IlMjBzcGFjZXxlbnwxfHx8fDE3NjQxMzYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        scandinavian: [
            'https://images.unsplash.com/photo-1724582586413-6b69e1c94a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQxMjUzODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1724582586413-6b69e1c94a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQxMjUzODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1724582586413-6b69e1c94a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQxMjUzODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1724582586413-6b69e1c94a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQxMjUzODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        french: [
            'https://images.unsplash.com/photo-1678775970375-05bbabcc6bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjQxMzYxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1678775970375-05bbabcc6bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjQxMzYxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1678775970375-05bbabcc6bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjQxMzYxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1678775970375-05bbabcc6bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjQxMzYxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        lovely: [
            'https://images.unsplash.com/photo-1756317058150-63264dea336c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlbHklMjBjdXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1756317058150-63264dea336c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlbHklMjBjdXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1756317058150-63264dea336c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlbHklMjBjdXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1756317058150-63264dea336c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlbHklMjBjdXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        pastel: [
            'https://images.unsplash.com/photo-1632999101501-47bd016f7e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1632999101501-47bd016f7e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1632999101501-47bd016f7e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1632999101501-47bd016f7e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBpbnRlcmlvciUyMHJvb218ZW58MXx8fHwxNzY0MTM2MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        modern: [
            'https://images.unsplash.com/photo-1520106392146-ef585c111254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjQxMzYxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1592401526914-7e5d94a8d6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY0MDY2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1520106392146-ef585c111254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjQxMzYxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1592401526914-7e5d94a8d6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY0MDY2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        bohemian: [
            'https://images.unsplash.com/photo-1600493504591-aa1849716b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2NDEzNjE1OHww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1600493504591-aa1849716b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2NDEzNjE1OHww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1600493504591-aa1849716b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2NDEzNjE1OHww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1600493504591-aa1849716b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2NDEzNjE1OHww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        classic: [
            'https://images.unsplash.com/photo-1716058845923-9212b7e0887b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1716058845923-9212b7e0887b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1716058845923-9212b7e0887b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1716058845923-9212b7e0887b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaW50ZXJpb3IlMjByb29tfGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        industrial: [
            'https://images.unsplash.com/photo-1652716279221-439c33c3b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBsb2Z0fGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1652716279221-439c33c3b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBsb2Z0fGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1652716279221-439c33c3b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBsb2Z0fGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1652716279221-439c33c3b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBsb2Z0fGVufDF8fHx8MTc2NDEzNjE1OXww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        minimal: [
            'https://images.unsplash.com/photo-1621363183028-c97aec91a9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwaW50ZXJpb3IlMjB3aGl0ZXxlbnwxfHx8fDE3NjQxMzYxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY0MDczNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1621363183028-c97aec91a9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwaW50ZXJpb3IlMjB3aGl0ZXxlbnwxfHx8fDE3NjQxMzYxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY0MDczNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]
    };

    // Elements
    const headerNav = document.getElementById('header-nav');
    const styleTags = document.getElementById('style-tags');
    const imageGrid = document.getElementById('image-grid');
    const emptyMessage = document.getElementById('empty-message');
    const preferenceMessage = document.getElementById('preference-message');
    const userNameDisplay = document.getElementById('user-name-display');

    // Initialize
    renderHeaderNav();
    renderStyleTags();
    renderImages();

    if (userPreferences && userPreferences.styles && userPreferences.styles.length > 0) {
        preferenceMessage.classList.remove('hidden');
        userNameDisplay.textContent = userEmail ? userEmail.split('@')[0] : (userPreferences.gender || '회원');
    }

    // Functions
    function renderHeaderNav() {
        headerNav.innerHTML = `
            <button onclick="window.location.href='mypage.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">마이페이지</button>
            <button onclick="window.location.href='reference_board.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">레퍼런스 보드</button>
            <button onclick="window.location.href='preference.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">취향분석</button>
            <button onclick="Auth.logout()" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">로그아웃</button>
        `;
    }

    function renderStyleTags() {
        styleTags.innerHTML = styleCategories.map(style => `
            <button onclick="toggleStyle('${style}')" class="px-6 py-2 rounded-full border-2 transition-all whitespace-nowrap ${selectedStyles.includes(style)
                ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white border-transparent shadow-lg'
                : 'bg-white text-purple-600 border-purple-300 hover:border-purple-400'
            }">
                ${style}
            </button>
        `).join('');
    }

    window.toggleStyle = (style) => {
        if (selectedStyles.includes(style)) {
            selectedStyles = selectedStyles.filter(s => s !== style);
        } else {
            selectedStyles.push(style);
        }
        renderStyleTags();
        renderImages();
    };

    function renderImages() {
        let displayImages = [];

        if (!userPreferences || selectedStyles.length === 0) {
            // Random images if no selection
            const allImages = [];
            styleCategories.forEach(style => {
                if (categoryImages[style]) allImages.push(...categoryImages[style]);
            });
            displayImages = allImages.sort(() => Math.random() - 0.5);
        } else {
            selectedStyles.forEach(style => {
                if (categoryImages[style]) displayImages.push(...categoryImages[style]);
            });
        }

        if (displayImages.length > 0) {
            imageGrid.innerHTML = displayImages.map((img, index) => `
                <div class="relative group">
                    <div class="aspect-square rounded-3xl overflow-hidden">
                        <img src="${img}" alt="Interior ${index + 1}" class="w-full h-full object-cover">
                    </div>
                    <button onclick="downloadImage('${img}', ${index})" class="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-gray-50">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        download
                    </button>
                </div>
            `).join('');
            emptyMessage.classList.add('hidden');
        } else {
            imageGrid.innerHTML = '';
            emptyMessage.classList.remove('hidden');
        }
        lucide.createIcons();
    }

    window.downloadImage = async (url, index) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `mood-on-reference-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('이미지 다운로드에 실패했습니다.');
        }
    };
});

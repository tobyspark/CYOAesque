const entryNode = 'intro';

export const content = {
    entryNode: entryNode,
    nodes: {
        mainMenu: {
            template: 'mainMenu',
            choices: [
                { text: 'Lorem who?', to: 'storyA1' },
                { text: 'Ipsum what?', to: 'storyA1' },
                { text: 'Dolor why?', to: 'storyA1' },
                { text: 'Sit where?', to: 'storyA1' },
                { text: 'Amet when?', to: 'storyA1' },
            ],
        },
        storyA1: {
            template: 'choice',
            text: 'This is placeholder content to demonstrate the codebase.',
            choices: [
                { text: 'Choose this', to: 'storyA2A', image: 'assets/cyoa001.jpg' },
                { text: 'Or this', to: 'storyA2B', image: 'assets/cyoa003.jpg' },
                { text: 'Perhaps this', to: 'storyA2C', image: 'assets/cyoa006.jpg' },
                { text: 'Or realise the futility...', to: 'storyA2D', image: 'assets/cyoa022.jpg' },
            ],
        },
        storyA2A: {
            template: 'choice',
            text: 'Good choice.',
            choices: [
                { text: 'Continue', to: entryNode, image: 'assets/cyoa001.jpg' },
            ],
        },
        storyA2B: {
            template: 'choice',
            text: 'Good choice.',
            choices: [
                { text: 'Continue', to: entryNode, image: 'assets/cyoa003.jpg' },
            ],
        },
        storyA2C: {
            template: 'choice',
            text: 'Good choice.',
            choices: [
                { text: 'Continue', to: entryNode, image: 'assets/cyoa006.jpg' },
            ],
        },
        storyA2D: {
            template: 'choice',
            text: 'Good choice.',
            choices: [
                { text: 'Continue', to: entryNode, image: 'assets/cyoa022.jpg' },
            ],
        },
    }
};

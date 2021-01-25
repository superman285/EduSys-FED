import Create from './create.vue';

export default {
    title: 'Create',
    component: Create,
};

export const component = () => ({
    components: { Create },
    template: `<create />`,
});

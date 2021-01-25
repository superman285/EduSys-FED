import { mount } from '@vue/test-utils';
import Create from './create';

describe('Spec Create', function() {
    it('mounts', () => {
        const wrapper = mount(Create);
        expect(wrapper)
            .toBeTruthy();
    });
});

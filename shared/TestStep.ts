export class TestStep {
    private steps: string[];

    constructor() {
        this.steps = [];
    }

    async log<T>(step: Promise<T> | T, description: string): Promise<T> {
        try {
            const resolvedStep = await Promise.resolve(step);
            const status = 'PASSED';
            this.steps.push(`${description} - ${status}`);
            return resolvedStep;
        } catch (error) {
            const status = 'FAILED';
            this.steps.push(`${description} - ${status}`);
            throw error;
        }
    }

    getSteps(): string[] {
        return this.steps;
    }
}

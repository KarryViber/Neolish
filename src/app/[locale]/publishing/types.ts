export interface PublishState {
  articleId: string | null; // Made non-nullable as it will be provided at the start
  selectedPlatforms: string[]; // e.g., ['x', 'wordpress', 'note']
  coverImageUrl: string | null;
  coverImageBase64: string | null | undefined;
  coverImagePrompt: string; // For AI generation
  coverImageStyle: string; // For AI generation
  referenceImageFiles: File[]; // For AI generation
  referenceImageUrls: string[]; // For AI generation (via URL)
  finalCoverImageFile: File | null; // User uploaded final version
  generatedTweets: string[]; // For X/Twitter (legacy format for backward compatibility)
  // New X/Twitter thread structure
  tweetThread: {
    main_post: string;
    thread_posts: string[];
  } | null;
  wordpressCategories: string[];
  wordpressTags: string[];
  publishAt: Date | null; // For scheduled publishing
  // Add other fields as needed for each step
}

export type PublishStepId =
  | 'selectPlatforms'
  | 'configureCoverImage'
  | 'adaptContentX'
  | 'adaptContentWordPress'
  | 'previewAndPublish';

// This will be used by the multi-step form component to define its sequence.
// It will be built dynamically based on selected platforms.
export interface StepConfig {
  id: PublishStepId;
  name: string; // Display name for the stepper
}

// Props for individual step components within the multi-step form
export interface StepComponentProps {
  // articleId is already part of PublishState, but could be passed for direct access if needed
  currentData: PublishState;
  updateData: (updates: Partial<PublishState>) => void;
  articleTitle?: string | null; // Added articleTitle
  // onNext and onPrevious will be handled by the parent multi-step form component
  // Individual steps might have their own internal validation before allowing parent to proceed.
}

// Props for the main multi-step form container component
export interface PublishFormStepsContainerProps {
  articleId: string;
  articleTitle?: string | null; // Add this for displaying the title
  initialState?: Partial<PublishState>; // For resuming a saved state
  onPublish: (finalState: PublishState) => void;
  onCancel: () => void;
} 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import existing UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import your event-specific code
import {
  createEventSchema,
  type CreateEventSchema,
} from "@/lib/validation/events";
import { createEvent } from "@/lib/mutations/eventMutations";
import { SPORT_TYPES } from "@/types/event";
import { extractErrorMessage } from "@/lib/errors";

const CreateEventDialog = () => {
  // Control dialog open/close state
  const [open, setOpen] = useState(false);

  // Setup form with Zod validation
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      sport: undefined,
      maxParticipants: 10, // Sensible default
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: CreateEventSchema) => {
    try {
      // Combine date and time fields into ISO strings
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

      // Prepare data for API (matches CreateEventData interface)
      const eventData = {
        name: values.name,
        sport: values.sport,
        maxParticipants: values.maxParticipants,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };
      // Call API to create event
      const newEvent = await createEvent(eventData);

      // Show success toast
      toast.success("Event created successfully!", {
        description: `${newEvent.name} has been created.`,
        position: "top-center",
        duration: 3000,
      });

      // Reset form fields
      form.reset();

      // Close the dialog
      setOpen(false);

      // Optional: Refresh events list here (for future)
      // queryClient.invalidateQueries(['events']);
    } catch (error: unknown) {
      // Extract user-friendly error message
      const errorMessage = extractErrorMessage(
        error,
        "Failed to create event. Please try again."
      );

      // Show error toast
      toast.error("Error", {
        description: errorMessage,
        position: "top-center",
        duration: 4000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* The button that opens the dialog */}
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>

      {/* The dialog popup */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Sport Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new sport event. You can invite
            participants later.
          </DialogDescription>
        </DialogHeader>

        {/* The form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Event Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sunday Football Match"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sport Type Dropdown */}
            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPORT_TYPES.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Participants Number Input */}
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      min={2}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date Field */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time Field */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date Field */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time Field */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;

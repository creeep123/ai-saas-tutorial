'use client';
import * as z from 'zod';
import axios from 'axios';
import Heading from '@/components/heading';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Music } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { formSchema } from './constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { useProModal } from '@/hooks/use-pro-modal';

const MusicPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [music, setMusic] = useState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post('/api/music', values);

      setMusic(response.data);

      form.reset();
    } catch (err) {
            if(err?.response?.status === 403) {
        proModal.onOpen();  
      }
      console.log(err);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turn your prompt into Music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      ></Heading>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
            rounded-lg
            border
            w-full
            p-4
            px-3
            md:px-6
            focus-within:shadow-sm
            grid
            grid-cols-12
            gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem
                  className="col-span-12
                lg:col-span-10"
                >
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none
                      focus-visible:ring-0
                      focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Piano solo"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
        {isLoading && (
          <div
            className="p-8 rounded-lg w-full flex 
          items-center justify-center bg-muted"
          >
            <Loader />
          </div>
        )}
        {!music && !isLoading && (
          <Empty label="No music generated." />
        )}
        {music && !isLoading && (
          <audio controls className='w-full mt-8'>
            <source src={music} />
          </audio>          
        )}
      </div>
      </div>

    </div>
  );
};

export default MusicPage;

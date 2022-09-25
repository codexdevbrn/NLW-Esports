import * as Dialog from "@radix-ui/react-dialog";
import { Check, GameController } from "phosphor-react";
import { Input } from "./Form/Input";
import { Label } from "./Form/Label";
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

interface Game {
  id: string;
  title: string;
}
export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  useEffect(() => {
    axios(
      'http://localhost:3335/games'
    ).then((res) => {
      setGames(res.data);
    });
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    if (!data.name) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:3335/games/${data.game}/ads`,
        {
          name: data.name,
          yearsPlaying: Number(data.yearsPlaying),
          discord: data.discord,
          weekDays: weekDays.map(Number),
          useVoiceChannel: useVoiceChannel,
          hourStart: data.hourStart,
          hourEnd: data.hourEnd,
        }
      );
      alert('Anúncio criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar o anúncio!');
      console.log(err);
    }
  }
  return (<Dialog.Portal>
    <Dialog.Overlay className="bg-black/60 inset-0 fixed">
      <Dialog.Content className="bg-[#2A2634] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">

        <Dialog.Title className="text-3xl text-white font-black">Publique um anúncio</Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              Qual o Game?</label>
            <select
              name="game" id="name"
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
            >

              <option disabled selected value="">Selecione o game que deseja jogar</option>
              {games.map(game => {
                return <option key={game.id} value={game.id}>{game.title}</option>
              })}
            </select>


          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Seu nome (ou nickname)</Label>
            <Input name="name"
              id="name" type="text"
              placeholder="Como te chamam dentro do game" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="yearsPlaying">Joga a quantos anos?</Label>
              <Input name="yearsPlaying"
                id="yearsPlaying" type="number"
                placeholder="Tudo bem ser ZERO"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discord">Qual seu Discord</Label>
              <Input name="discord"
                id="discord" type="text"
                placeholder="Usuário#0000"
              />
            </div>
          </div>

          <div className="flex gap-6">

            <div className="flex flex-col gap-2">
              <Label htmlFor="weekDays">Quando costuma jogar</Label>

              <ToggleGroup.Root type="multiple" className="grid grid-cols-4 gap-2" onValueChange={setWeekDays}>

                <ToggleGroup.Item
                  value="0"
                  title="Domingo"
                  className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  title="Segunda"
                  className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  S
                </ToggleGroup.Item>

                <ToggleGroup.Item
                  value="2"
                  title="Terça"
                  className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  T
                </ToggleGroup.Item>

                <ToggleGroup.Item
                  value="3"
                  title="Quarta"
                  className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  Q
                </ToggleGroup.Item>

                <ToggleGroup.Item
                  value="4"
                  title="Qunita"
                  className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  Q
                </ToggleGroup.Item>

                <ToggleGroup.Item
                  value="5"
                  title="Sexta"
                  className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  S
                </ToggleGroup.Item>

                <ToggleGroup.Item
                  value="6"
                  title="Sábado"
                  className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}>
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>

            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="hourStart">Qual horário do dia?</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input name="hourStart"
                  id="hourStart" type="time"
                  placeholder="De" />
                <Input name="hourEnd" id="hourEnd" type="time"
                  placeholder="Até" />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <Checkbox.Root
              className="w-6 h-6 rounded bg-zinc-900"
              onCheckedChange={(checked) => {
                if (checked == true) {
                  setUseVoiceChannel(true)
                } else {
                  setUseVoiceChannel(false)
                }
              }}
            >
              <Checkbox.Indicator>
                <Check className="w-6 h-6 p-1 text-emerald-400"></Check>
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-700">Cancelar</Dialog.Close>
            <button type="submit" className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-700">
              <GameController className="w-6 h-6" />
              Encontrar Duo
            </button >
          </footer>
        </form>
      </Dialog.Content>

    </Dialog.Overlay>
  </Dialog.Portal>

  );

}
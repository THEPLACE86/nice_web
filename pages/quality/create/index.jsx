import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {supabase} from "../../../utils/supabaseClient";

function Create(props) {
    const { testDate, testRound } = props;
    const router = useRouter();
    const { register, handleSubmit, setValue } = useForm();

    async function onSave(values) {
        console.log('Success:', values.company);
        const { data, error } = await supabase.from('product').insert({
            'company' : values.company,
            'place' : values.place,
            'area': values.area,
            'a25': values.a25,
            'a32': values.a32,
            'a40': values.a40,
            'a50': values.a50,
            'a65': values.a65,
            'm65' : values.m65,
            'm80' : values.m80,
            'm100' : values.m100,
            'm125' : values.m125,
            'm150' : values.m150,
            'test_date' : testDate,
            'initial' : values.initial,
            'test_round' : testRound,
            'totalH': parseInt(values.a32)+parseInt(values.a40)+parseInt(values.a50)+parseInt(values.a65)+
                parseInt(values.m65)+parseInt(values.m80)+parseInt(values.m100)+parseInt(values.m125)+parseInt(values.m150)

        }).select('id')

        await supabase.from('bunch').insert({
            'place': values.company + ' ' + values.place + ' ' + values.area,
            'test_list_id': data[0].id,
            'test_date': testDate,
            'test_round': testRound,
            'initial' : values.initial,
            'print': parseInt(values.a25) + parseInt(values.a32) + parseInt(values.a40) + parseInt(values.a50) + parseInt(values.a65) !== 0
        }).then(() => router.back())
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit(onSave)} className="max-w-full space-y-6">
                <div className="flex flex-wrap space-x-4">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                            회사명
                        </label>
                        <input
                            {...register("company", { required: true })}
                            id="company"
                            className="input input-bordered mt-1"
                            placeholder="회사명"
                        />
                    </div>
                    <div>
                        <label htmlFor="place" className="block text-sm font-medium text-gray-700">
                            현장명
                        </label>
                        <input
                            {...register("place", { required: true })}
                            id="place"
                            className="input input-bordered mt-1"
                            placeholder="현장명"
                        />
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            구역명
                        </label>
                        <input
                            {...register("area", { required: true })}
                            id="area"
                            className="input input-bordered mt-1"
                            placeholder="구역명"
                        />
                    </div>
                    <div>
                        <label htmlFor="initial" className="block text-sm font-medium text-gray-700">
                            이니셜
                        </label>
                        <input
                            {...register("initial", { required: true })}
                            id="initial"
                            className="input input-bordered mt-1"
                            placeholder="이니셜"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap space-x-4 mt-4">
                    {/* Add a similar wrapper div and label for each input field */}
                    <div>
                        <label htmlFor="a25" className="block text-sm font-medium text-gray-700">
                            A25
                        </label>
                        <input
                            {...register("a25", { required: true })}
                            id="a25"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="a32" className="block text-sm font-medium text-gray-700">
                            A32
                        </label>
                        <input
                            {...register("a32", { required: true })}
                            id="a32"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="a40" className="block text-sm font-medium text-gray-700">
                            A40
                        </label>
                        <input
                            {...register("a40", { required: true })}
                            id="a40"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="a50" className="block text-sm font-medium text-gray-700">
                            A50
                        </label>
                        <input
                            {...register("a50", { required: true })}
                            id="a50"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="a65" className="block text-sm font-medium text-gray-700">
                            A65
                        </label>
                        <input
                            {...register("a65", { required: true })}
                            id="a65"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    {/* ... */}
                </div>

                <div className="flex flex-wrap space-x-4 mt-4">
                    {/* Add a similar wrapper div and label for each input field */}
                    <div>
                        <label htmlFor="m65" className="block text-sm font-medium text-gray-700">
                            M65
                        </label>
                        <input
                            {...register("m65", { required: true })}
                            id="m65"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="m80" className="block text-sm font-medium text-gray-700">
                            M80
                        </label>
                        <input
                            {...register("m80", { required: true })}
                            id="m80"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="m100" className="block text-sm font-medium text-gray-700">
                            M100
                        </label>
                        <input
                            {...register("m100", { required: true })}
                            id="m100"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="m125" className="block text-sm font-medium text-gray-700">
                            M125
                        </label>
                        <input
                            {...register("m125", { required: true })}
                            id="m125"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="m150" className="block text-sm font-medium text-gray-700">
                            M150
                        </label>
                        <input
                            {...register("m150", { required: true })}
                            id="m150"
                            className="input input-bordered mt-1"
                            defaultValue="0"
                        />
                    </div>
                    {/* ... */}
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary w-48">
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}

Create.getInitialProps = ({ query }) => {
    return { testDate: query.testDate, testRound: query.testRound };
};

export default Create;

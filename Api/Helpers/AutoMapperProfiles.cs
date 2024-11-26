using AutoMapper;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;

namespace WebApi.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(
                destinationMember => destinationMember.Age,
                options => options.MapFrom(src => src.DateOfBirth.CalculateAge())
            )
            .ForMember(
                destinationMember => destinationMember.PhotoUrl,
                options => options.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();
        CreateMap<String, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
    }
}